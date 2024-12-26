import React, {useState, useRef} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {initiateGenerateDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import TagsInput from 'shared/ui/TagsInput/TagsInput.tsx';
interface GetDailyMealsModalProps {
  date: string;
}

export const GetDailyMealsModal: React.FC<GetDailyMealsModalProps> = ({
  date,
}) => {
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();

  const handleGenerateMeals = async () => {
    try {
      setIsButtonLoading(true);
      await dispatch(
        initiateGenerateDailyMeals({
          date: date,
          description:
            description + ', используй эти продукты: ' + products?.join(', '),
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

  const disabledAddButton = isButtonLoading || !description;

  return (
    <View style={styles.container}>
      <CustomButton
        style={{marginBottom: 10, width: '100%'}}
        title={'Получить диету на весь день'}
        onPress={handleShowSheet}
      />
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
            placeholder="Добавить предпочитаемый продукт"
            value={products}
            onChange={setProducts}
          />
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
});
