import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import CheckBox from './Checkbox';
import {useAppSelector} from 'shared/lib/state/selector/useAppSelector';
import {RootState} from 'app/providers/StoreProvider';
import moment from 'moment';
import {Meal} from 'entities/meal/model/types/mealTypes.ts';
import 'moment/locale/ru';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {updateIngredientChecked} from 'entities/meal/model/api/mealApi.ts'; // Импорт API функции
import {updateMealDetailsLocally} from 'entities/meal/model/slices/mealSlice.ts'; // Импорт экшена
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts'; // Импорт диспатча

moment.locale('ru');

const Cart = () => {
  const dispatch = useAppDispatch();
  const mealsDetails = useAppSelector(
    (state: RootState) => state.meal.mealsDetails as Meal[],
  );

  // Локальное состояние для хранения данных покупок
  const [shoppingData, setShoppingData] = useState<
    {
      date: string;
      items: {
        id: string;
        name: string;
        quantity: string;
        checked: boolean;
        date: string;
      }[];
    }[]
  >([]);

  const [groupByDate, setGroupByDate] = useState(true); // Состояние для группировки по датам

  // Состояние для выбора дат "от" и "до"
  const [dateRange] = useState({
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
  });

  // useEffect для группировки ингредиентов и объединения одинаковых ингредиентов
  useEffect(() => {
    const allItems = mealsDetails.flatMap(mealDetail =>
      mealDetail?.mealDetail?.ingredients
        ? mealDetail.mealDetail.ingredients.map((ingredient, index) => ({
            id: `${mealDetail.id}-${index}`,
            name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.units}`,
            checked: ingredient.checked || false,
            date: mealDetail.date,
          }))
        : [],
    );

    const filteredItems = allItems.filter(item => {
      const itemDate = moment(item.date);
      return itemDate.isBetween(
        moment(dateRange.from),
        moment(dateRange.to),
        undefined,
        '[]',
      );
    });

    const groupedItems = filteredItems.reduce<{
      [key: string]: {
        id: string;
        name: string;
        quantity: string;
        checked: boolean;
        date: string;
      }[];
    }>((acc, item) => {
      const key = groupByDate ? item.date : 'all';
      const existingItem = acc[key]?.find(
        i => i.name === item.name && i.checked === item.checked,
      );

      if (existingItem) {
        const [existingAmount, existingUnits] =
          existingItem.quantity.split(' ');
        const [newAmount, newUnits] = item.quantity.split(' ');

        if (existingUnits === newUnits) {
          existingItem.quantity = `${
            parseFloat(existingAmount) + parseFloat(newAmount)
          } ${existingUnits}`;
        } else {
          acc[key].push(item);
        }
      } else {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
      }

      return acc;
    }, {});

    setShoppingData(
      Object.entries(groupedItems).map(([key, items]) => ({
        date: key,
        items,
      })),
    );
  }, [mealsDetails, groupByDate, dateRange]);

  // Функция для переключения состояния чекбокса
  const toggleCheckBox = async (
    name: string,
    checked: boolean,
    date?: string,
  ) => {
    setShoppingData(prevData =>
      prevData.map(section => ({
        ...section,
        items: section.items.map(item =>
          groupByDate && date
            ? item.name === name && item.date === date
              ? {...item, checked}
              : item
            : item.name === name
            ? {...item, checked}
            : item,
        ),
      })),
    );

    // Обновление состояния для всех одинаковых ингредиентов
    try {
      const updatedMealsDetails = mealsDetails.map(mealDetail => {
        if (groupByDate && date) {
          if (mealDetail.date === date && mealDetail.mealDetail) {
            const updatedIngredients = mealDetail.mealDetail.ingredients.map(
              ingredient =>
                ingredient.name === name
                  ? {...ingredient, checked}
                  : ingredient,
            );
            return {
              ...mealDetail,
              mealDetail: {
                ...mealDetail.mealDetail,
                ingredients: updatedIngredients,
              },
            };
          }
        } else if (mealDetail.mealDetail) {
          const updatedIngredients = mealDetail.mealDetail.ingredients.map(
            ingredient =>
              ingredient.name === name ? {...ingredient, checked} : ingredient,
          );
          return {
            ...mealDetail,
            mealDetail: {
              ...mealDetail.mealDetail,
              ingredients: updatedIngredients,
            },
          };
        }
        return mealDetail;
      });

      dispatch(updateMealDetailsLocally(updatedMealsDetails));

      for (const mealDetail of mealsDetails) {
        if (groupByDate && date) {
          if (mealDetail.date === date && mealDetail.mealDetail) {
            const ingredient = mealDetail.mealDetail.ingredients.find(
              ingredient => ingredient.name === name,
            );
            if (ingredient) {
              await updateIngredientChecked(mealDetail.id, name, checked);
            }
          }
        } else if (mealDetail.mealDetail) {
          const ingredient = mealDetail.mealDetail.ingredients.find(
            ingredient => ingredient.name === name,
          );
          if (ingredient) {
            await updateIngredientChecked(mealDetail.id, name, checked);
          }
        }
      }
      // Закомментируем следующую часть кода для быстрой работы чтобы постоянно не дергалась API:
      // for (const mealDetail of mealsDetails) {
      //   dispatch(fetchMealDetails({ mealId: mealDetail.id }));
      // }
    } catch (error) {
      console.error('Ошибка при обновлении статуса ингредиента:', error);
    }
  };

  // Функция форматирования даты
  const formatDate = (date: string) => {
    const momentDate = moment(date);
    const isPast = momentDate.isBefore(moment(), 'day');
    const formattedDate = momentDate.format('D MMMM, dddd');
    return isPast ? (
      <CustomText style={styles.checkedText}>{formattedDate}</CustomText>
    ) : (
      formattedDate
    );
  };

  // Функция для форматирования диапазона дат
  const formatRange = (from: string, to: string) => {
    const fromDate = moment(from).format('D MMMM');
    const toDate = moment(to).format('D MMMM');
    return `${fromDate} - ${toDate}`;
  };

  // Функция рендеринга элемента списка
  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      quantity: string;
      checked: boolean;
      date: string;
    };
  }) => (
    <TouchableOpacity
      onPress={() => toggleCheckBox(item.name, !item.checked, item.date)}
      style={styles.itemContainer}>
      <CheckBox
        value={item.checked}
        onPress={() => toggleCheckBox(item.name, !item.checked, item.date)}
      />
      <CustomText style={[styles.itemText, item.checked && styles.checkedText]}>
        {item.name}
      </CustomText>
      <CustomText style={styles.quantityText}>{item.quantity}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>Список продуктов</CustomText>
        <Button
          title="Группировка"
          onPress={() => setGroupByDate(!groupByDate)}
        />
      </View>
      <FlatList
        data={shoppingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.sectionContainer}>
            <CustomText style={styles.sectionTitle}>
              {groupByDate
                ? formatDate(item.date)
                : `Даты: ${formatRange(dateRange.from, dateRange.to)}`}
            </CustomText>
            <FlatList
              data={item.items}
              keyExtractor={subItem => subItem.id}
              renderItem={renderItem}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.confirmButton}>
        <CustomText style={styles.confirmButtonText}>
          Подтвердить покупку
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

// Стили для компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  quantityText: {
    fontSize: 16,
    color: '#888',
  },
  confirmButton: {
    backgroundColor: '#31D6D6',
    padding: 16,
    borderRadius: 33,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default Cart;
