import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import CheckBox from './Checkbox';
import {useAppSelector} from 'shared/lib/state/selector/useAppSelector';
import {RootState} from 'app/providers/StoreProvider';
import moment from 'moment';
import {Meal} from 'entities/meal/model/types/mealTypes.ts';
import 'moment/locale/ru';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {updateIngredientChecked} from 'entities/meal/model/api/mealApi.ts';
import {
  fetchDaysWithMeals,
  fetchUnloadedMealsDetails,
  updateMealDetailsLocally,
} from 'entities/meal/model/slices/mealSlice.ts';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {FilterIcon} from 'shared/assets/icons';
import {useFocusEffect} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import i18n from 'shared/config/i18n/i18n.ts';

const Cart = () => {
  const dispatch = useAppDispatch();
  const mealsDetails = useAppSelector(
    (state: RootState) => state.meal.mealsDetails as Meal[],
  );
  const status = useAppSelector((state: RootState) => state.meal.status);
  const loadingPercentage = useAppSelector(
    (state: RootState) => state.meal.loadingPercentage,
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
        mealCount: number;
      }[];
    }[]
  >([]);

  const [groupByDate, setGroupByDate] = useState(true); // Состояние для группировки по датам

  // Состояние для выбора дат "от" и "до"
  const [dateRange] = useState({
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        const endDate = moment().add(7, 'days').format('YYYY-MM-DD');
        await dispatch(fetchDaysWithMeals({startDate, endDate}));
        await dispatch(fetchUnloadedMealsDetails());
      };

      fetchData();
    }, [dispatch]),
  );

  useEffect(() => {
    const allItems = mealsDetails.flatMap(mealDetail =>
      mealDetail?.mealDetail?.ingredients
        ? mealDetail.mealDetail.ingredients.map((ingredient, index) => ({
            id: `${mealDetail.id}-${index}`,
            name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.units}`,
            checked: ingredient.checked || false,
            date: moment(mealDetail.date + ' ' + mealDetail.time).format(
              'YYYY-MM-DD HH:mm',
            ), // Ensure consistent date format
            mealCount: 1, // Добавляем mealCount, чтобы учитывать количество приемов пищи
          }))
        : [],
    );

    const filteredItems = allItems.filter(item => {
      const itemDate = moment(item.date, 'YYYY-MM-DD HH:mm');
      return itemDate.isAfter(moment());
    });

    const groupedItems = filteredItems.reduce<{
      [key: string]: {
        id: string;
        name: string;
        quantity: string;
        checked: boolean;
        date: string;
        mealCount: number;
      }[];
    }>((acc, item) => {
      const key = groupByDate ? item.date.split(' ')[0] : 'all'; // Group by date only
      if (!acc[key]) {
        acc[key] = [];
      }
      const existingItem = acc[key].find(
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
          existingItem.mealCount += 1; // Увеличиваем количество приемов пищи
        } else {
          acc[key].push(item);
        }
      } else {
        acc[key].push(item);
      }

      return acc;
    }, {});

    const sortedShoppingData = Object.entries(groupedItems).map(
      ([key, items]) => ({
        date: key,
        items: items.sort((a, b) => a.name.localeCompare(b.name)), // Сортировка по алфавиту
      }),
    );

    setShoppingData(sortedShoppingData);
  }, [mealsDetails, groupByDate, dateRange]);

  // Функция форматирования даты с проверкой на валидность
  const formatDate = (date: string) => {
    const momentDate = moment(date);
    if (!momentDate.isValid()) {
      return '';
    }
    const isPast = momentDate.isBefore(moment(), 'day');
    const formattedDate = momentDate.format('D MMMM, dddd');
    return isPast ? (
      <CustomText style={styles.checkedText}>{formattedDate}</CustomText>
    ) : (
      formattedDate
    );
  };

  // Функция форматирования диапазона дат
  const formatRange = (from: string, to: string) => {
    const fromDate = moment(from).format('D MMMM');
    const toDate = moment(to).format('D MMMM');
    return `${fromDate} - ${toDate}`;
  };

  // Функция для переключения состояния чекбокса
  const toggleCheckBox = async (
    name: string,
    checked: boolean,
    date?: string,
  ) => {
    setShoppingData(prevData =>
      prevData.map(section => {
        if (groupByDate && date) {
          // Если groupByDate true и передана дата, то обновляем состояние только одинаковых ингредиентов
          return {
            ...section,
            items: section.items.map(item =>
              item.name === name &&
              item.date.split(' ')[0] === date.split(' ')[0]
                ? {...item, checked}
                : item,
            ),
          };
        } else {
          // В ином случае, обновляем состояние только одного элемента
          return {
            ...section,
            items: section.items.map(item =>
              item.name === name ? {...item, checked} : item,
            ),
          };
        }
      }),
    );

    // Обновление состояния для всех одинаковых ингредиентов в mealsDetails
    try {
      const updatedMealsDetails = mealsDetails.map(mealDetail => {
        if (groupByDate && date) {
          if (
            mealDetail.date.split(' ')[0] === date.split(' ')[0] &&
            mealDetail.mealDetail
          ) {
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
          if (
            mealDetail.date.split(' ')[0] === date.split(' ')[0] &&
            mealDetail.mealDetail
          ) {
            for (const ingredient of mealDetail.mealDetail.ingredients) {
              if (ingredient.name === name) {
                await updateIngredientChecked(
                  mealDetail.id,
                  ingredient.name,
                  checked,
                );
              }
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
    } catch (error) {
      console.error('Ошибка при обновлении статуса ингредиента:', error);
    }
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
      mealCount: number;
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
        {item.name} {item.mealCount > 1 && `(${item.mealCount})`}
      </CustomText>
      <CustomText style={styles.quantityText}>{item.quantity}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>
          {i18n.t('Список продуктов')}
        </CustomText>
        <TouchableOpacity
          onPress={() => setGroupByDate(!groupByDate)}
          style={{marginTop: 5}}>
          <FilterIcon width={30} height={30} />
        </TouchableOpacity>
      </View>
      {loadingPercentage !== 100 && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.loadingText}>
            {i18n.t('Фомирование корзины')}
          </Text>
          <AnimatedCircularProgress
            size={50}
            width={2}
            fill={loadingPercentage} // Подстройте процент на основе значения калорий
            tintColor="#31D6D6"
            backgroundColor="#E0E0E0">
            {() => (
              <Text style={styles.loadingProgress}>{loadingPercentage}%</Text>
            )}
          </AnimatedCircularProgress>
        </View>
      )}

      <FlatList
        data={shoppingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.sectionContainer}>
            <CustomText style={styles.sectionTitle}>
              {groupByDate
                ? formatDate(item.date)
                : i18n.t('Даты') +
                  `: ${formatRange(dateRange.from, dateRange.to)}`}
            </CustomText>
            <FlatList
              data={item.items}
              keyExtractor={subItem => subItem.id}
              renderItem={renderItem}
            />
          </View>
        )}
      />
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
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 10,
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
  loadingText: {
    color: '#67CFCF',
    fontSize: 20,
    marginRight: 10,
  },
  loadingProgress: {
    textAlign: 'center',
    color: '#67CFCF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Cart;
