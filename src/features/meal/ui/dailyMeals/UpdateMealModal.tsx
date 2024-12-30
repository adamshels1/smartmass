import React, {useState, useRef, useMemo, useCallback} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch';
import {
  fetchDailyMeals,
  initiateUpdateMeal,
} from 'entities/meal/model/slices/mealSlice';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import CustomText from 'shared/ui/CustomText/CustomText';
import TagsInput from 'shared/ui/TagsInput/TagsInput';
import {EditIcon} from 'shared/assets/icons';
import {Meal} from 'entities/meal/model/types/mealTypes';
import {updateMealRequests} from 'entities/meal/model/api/mealApi';
import CheckBox from 'features/cart/ui/Checkbox';
import {RootState} from 'app/providers/StoreProvider/config/store';
import {useSelector} from 'react-redux';

interface UpdateMealModalProps {
  item: Meal;
}

export const UpdateMealModal: React.FC<UpdateMealModalProps> = ({item}) => {
  const [description, setDescription] = useState(item?.requestDescription);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();
  const {preferredFoods} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  const selectedFoods = useMemo(() => {
    const allFoods = Array.from(
      new Set([...item?.requestIngredients, ...preferredFoods]),
    );
    return allFoods.map(food => ({
      name: food,
      checked: item?.requestIngredients.includes(food),
    }));
  }, [item, preferredFoods]);

  const [foods, setFoods] = useState(selectedFoods);

  const resetState = useCallback(() => setDescription(''), []);

  const handleUpdateMealRequests = useCallback(async () => {
    try {
      setIsButtonLoading(true);
      const selected = foods
        .filter(food => food.checked)
        .map(food => food.name);
      await updateMealRequests(item.id, description, selected);
      await dispatch(initiateUpdateMeal(item.id));
      await dispatch(fetchDailyMeals({date: item.date}));
      resetState();
      actionSheetRef.current?.hide();
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: error.response?.message || 'Произошла ошибка',
      });
    } finally {
      setIsButtonLoading(false);
    }
  }, [foods, description, item, dispatch, resetState]);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => actionSheetRef.current?.show()}
        hitSlop={{top: 20, bottom: 40, left: 20, right: 20}}>
        <EditIcon width={25} height={25} fill={'#fff'} />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <CustomText style={styles.title}>Заменить прием пищи</CustomText>
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
            placeholder="Введите описание"
            onChangeText={setDescription}
            value={description}
          />
          <CustomButton
            title="Отправить"
            onPress={handleUpdateMealRequests}
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
  container: {alignItems: 'center'},
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  sheetContent: {padding: 20},
  title: {fontSize: 20, fontWeight: '600', marginBottom: 20},
  foodList: {marginVertical: 10},
  itemContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  itemText: {flex: 1, fontSize: 16},
  checkedText: {},
});

export default UpdateMealModal;
