import React, {useState, useRef, useCallback} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {initiateGenerateDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import TagsInput from 'shared/ui/TagsInput/TagsInput.tsx';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';
import CheckBox from 'features/cart/ui/Checkbox.tsx';
import LottieView from 'lottie-react-native';
interface GetDailyMealsModalProps {
  date: string;
}

export const GetDailyMealsModal: React.FC<GetDailyMealsModalProps> = ({
  date,
}) => {
  const [description, setDescription] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();

  const {preferredFoods} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  const [foods, setFoods] = useState<{name: string; checked: boolean}[]>(
    preferredFoods.map(food => ({name: food, checked: false})),
  );

  const toggleCheckBox = useCallback((name: string) => {
    setFoods(prevState =>
      prevState.map(food =>
        food.name === name ? {...food, checked: !food.checked} : food,
      ),
    );
  }, []);

  const handleAddTag = useCallback((tag: string) => {
    setFoods(prevState => {
      const exists = prevState.some(food => food.name === tag);
      if (exists) {
        return prevState.map(food =>
          food.name === tag ? {...food, checked: true} : food,
        );
      }
      return [{name: tag, checked: true}, ...prevState];
    });
  }, []);

  const disabledAddButton =
    isButtonLoading || !(description || foods.some(food => food.checked));

  const handleGenerateMeals = async () => {
    try {
      setIsButtonLoading(true);
      await dispatch(
        initiateGenerateDailyMeals({
          date: date,
          description:
            description +
            ', используй эти продукты: ' +
            foods
              .filter(food => food.checked)
              ?.map(food => food.name)
              ?.join(', '),
        }),
      );
      // dispatch(fetchDailyMeals({date}));
      resetState();
      actionSheetRef.current?.hide(); // Закрыть ActionSheet после добавления
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: '',
        textBody: error.response.message,
      });
      console.error('Failed to add unplanned meal:', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const resetState = () => {
    setDescription('');
  };

  const handleShowSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.show();
    } else {
      console.warn('ActionSheet ref is not set');
    }
  };

  return (
    <View style={styles.container}>
      {/*<CustomButton*/}
      {/*  style={{marginBottom: 10, width: '100%'}}*/}
      {/*  title={'Получить диету на весь день'}*/}
      {/*  onPress={handleShowSheet}*/}
      {/*/>*/}

      {/*<LottieView*/}
      {/*  style={{*/}
      {/*    width: 200, // Adjust width for different animations*/}
      {/*    height: 200, // Adjust height for different animations*/}
      {/*    marginTop: 60, // Adjust margin for different animations*/}
      {/*    marginBottom: 0, // Adjust margin for different animations*/}
      {/*  }}*/}
      {/*  source={require('shared/assets/animations/add.json')}*/}
      {/*  autoPlay*/}
      {/*  loop={true}*/}
      {/*/>*/}

      <TouchableOpacity
        onPress={handleShowSheet}
        style={{
          backgroundColor: '#e1e1e1',
          borderRadius: 100,
          alignItems: 'center',
          marginVertical: 10,
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View style={{width: '90%'}}>
          <CustomText style={{color: '#000', fontWeight: '600', fontSize: 16}}>
            Получить диету на весь день
          </CustomText>
          <CustomText style={{color: '#000', fontSize: 14, marginTop: 3}}>
            Рацион будет сформирован с помощью Искусственного Интеллекта.
          </CustomText>
        </View>
        {/*<AddIcon />*/}
        <LottieView
          style={{
            width: 60, // Adjust width for different animations
            height: 60, // Adjust height for different animations
            marginTop: 0, // Adjust margin for different animations
            marginBottom: 0, // Adjust margin for different animations
            right: 10,
          }}
          source={require('shared/assets/animations/add.json')}
          autoPlay
          loop={true}
        />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <CustomText style={styles.title}>
            Получить диету на этот день
          </CustomText>
          <TagsInput
            label="Предпочитаемые продукты"
            placeholder="Добавить продукт"
            isVisibleTags={false}
            onAddTag={handleAddTag}
          />
          <View style={styles.foodList}>
            {foods.map(food => (
              <TouchableOpacity
                key={food.name}
                onPress={() => toggleCheckBox(food.name)}>
                <View style={styles.itemContainer}>
                  <CheckBox
                    value={food.checked}
                    onPress={() => toggleCheckBox(food.name)}
                  />
                  <CustomText
                    style={[
                      styles.itemText,
                      food.checked && styles.checkedText,
                    ]}>
                    {food.name}
                  </CustomText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <CustomTextInput
            label="Описание пищи"
            placeholder="Введите описание пищи"
            onChangeText={setDescription}
            value={description}
          />
          <CustomButton
            title="Отправить"
            onPress={handleGenerateMeals}
            loading={isButtonLoading}
            disabled={disabledAddButton}
          />
          <CustomButton
            title="Закрыть"
            onPress={() => actionSheetRef.current?.hide()}
          />
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff', // Белый фон для контейнера
  },
  sheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  loader: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    bottom: 0,
  },
  foodList: {marginVertical: 10},
  itemContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  itemText: {flex: 1, fontSize: 16},
  checkedText: {},
});
