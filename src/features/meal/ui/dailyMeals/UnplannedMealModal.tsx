import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import SelectInput from 'shared/ui/SelectInput/SelectInput.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {BurgerIcon} from 'shared/assets/icons';
import {sendMessageToAI} from 'entities/chat/model/api/chataiApi.ts';
import {addUnplannedMeal} from 'entities/meal/model/api/mealApi.ts';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {fetchDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';

interface UnplannedMealFormProps {
  date: string;
}

const UnplannedMealForm: React.FC<UnplannedMealFormProps> = ({date}) => {
  const [food, setFood] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (food) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        sendMessageToAI('skolko primerno kallorii ' + food, 'integer').then(
          response => {
            if (response && response.aiResponse) {
              setCalories(response.aiResponse);
            }
            setIsLoading(false);
          },
        );
      }, 1000); // Adjust delay as needed
      return () => clearTimeout(timeoutId);
    }
  }, [food]);

  const handleAdd = async () => {
    try {
      setIsButtonLoading(true);
      await addUnplannedMeal(date, food, time, parseInt(calories, 10));
      dispatch(fetchDailyMeals({date, userId: 1}));
      console.log({food, time, calories});
      actionSheetRef.current?.hide(); // Закрыть ActionSheet после добавления
    } catch (error) {
      console.error('Failed to add unplanned meal:', error);
    } finally {
      setIsButtonLoading(false);
    }
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
      <TouchableOpacity style={{marginRight: 20}} onPress={handleShowSheet}>
        <BurgerIcon width={50} height={50} fill={'#ff0000'} />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <Text style={styles.title}>Незапланированный прием пищи</Text>
          <CustomTextInput
            label="Пища"
            placeholder="Введите пищу"
            onChangeText={setFood}
            value={food}
          />
          <SelectInput
            label="Время"
            value={time}
            onValueChange={setTime}
            items={[
              {label: '6:00', value: '6:00'},
              {label: '7:00', value: '7:00'},
              {label: '8:00', value: '8:00'},
              {label: '9:00', value: '9:00'},
              {label: '10:00', value: '10:00'},
              {label: '11:00', value: '11:00'},
              {label: '12:00', value: '12:00'},
              {label: '13:00', value: '13:00'},
              {label: '14:00', value: '14:00'},
              {label: '15:00', value: '15:00'},
              {label: '16:00', value: '16:00'},
              {label: '17:00', value: '17:00'},
              {label: '18:00', value: '18:00'},
              {label: '19:00', value: '19:00'},
              {label: '20:00', value: '20:00'},
              {label: '21:00', value: '21:00'},
              {label: '22:00', value: '22:00'},
              {label: '23:00', value: '23:00'},
              {label: '00:00', value: '00:00'},
              {label: '01:00', value: '01:00'},
              {label: '02:00', value: '02:00'},
              {label: '03:00', value: '03:00'},
              {label: '04:00', value: '04:00'},
              {label: '05:00', value: '05:00'},
            ]}
            placeholder={{label: 'Выберите время', value: null}}
          />
          <CustomTextInput
            label="Калорийность"
            placeholder="Введите калорийность"
            onChangeText={setCalories}
            value={calories}
            keyboardType="numeric"
            maxLength={3} // Максимальная длина для калорий
          />
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="gray"
              style={{
                position: 'absolute',
                top: 110,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
          <CustomButton
            title="Добавить"
            onPress={handleAdd}
            loading={isButtonLoading}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa', // Светлый фон для проверки
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
    fontWeight: 'bold',
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
});

export default UnplannedMealForm;
