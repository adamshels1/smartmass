import React, {useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {
  fetchDailyMeals,
  initiateUpdateMeal,
} from 'entities/meal/model/slices/mealSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import TagsInput from 'shared/ui/TagsInput/TagsInput.tsx';
import {EditIcon} from 'shared/assets/icons';
import {Meal} from 'entities/meal/model/types/mealTypes.ts';
import {updateMealRequests} from 'entities/meal/model/api/mealApi.ts';
interface UpdateMealModalProps {
  item: Meal;
}

export const UpdateMealModal: React.FC<UpdateMealModalProps> = ({item}) => {
  const [description, setDescription] = useState(item?.requestDescription);
  const [ingredients, setIngredients] = useState<string[]>(
    item?.requestIngredients,
  );
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();

  const handleUpdateMealRequests = async () => {
    try {
      setIsButtonLoading(true);
      await updateMealRequests(item.id, description, ingredients);
      await dispatch(initiateUpdateMeal(item.id));
      await dispatch(fetchDailyMeals({date: item.date}));
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
      <TouchableOpacity onPress={handleShowSheet}>
        <EditIcon width={25} height={25} fill={'#fff'} />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <CustomText style={styles.title}>Заменить прием пищи</CustomText>
          <TagsInput
            label="Предпочитаемые продукты"
            placeholder="Добавить предпочитаемый продукт"
            value={ingredients}
            onChange={setIngredients}
          />
          <CustomTextInput
            label="Описание пищи"
            placeholder="Введите описание пищи"
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
