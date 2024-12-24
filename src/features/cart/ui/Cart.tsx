import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import CheckBox from './Checkbox';
import {useAppSelector} from 'shared/lib/state/selector/useAppSelector';
import {RootState} from 'app/providers/StoreProvider';
import moment from 'moment';
import {Meal} from 'entities/meal/model/types/mealTypes.ts';
import 'moment/locale/ru';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
moment.locale('ru');

const Cart = () => {
  const mealsDetails = useAppSelector(
    (state: RootState) => state.meal.mealsDetails as Meal[],
  );

  const [shoppingData, setShoppingData] = useState<
    {
      date: string;
      items: {id: string; name: string; quantity: string; checked: boolean}[];
    }[]
  >([]);

  useEffect(() => {
    const allItems = mealsDetails.flatMap(mealDetail =>
      mealDetail?.mealDetail?.ingredients.map((ingredient, index) => ({
        id: `${mealDetail.id}-${index}`,
        name: ingredient.name,
        quantity: `${ingredient.amount} ${ingredient.units}`,
        checked: false,
        date: mealDetail.date, // добавляем дату к каждому ингредиенту
      })),
    );

    // Группировка ингредиентов по датам
    const groupedItems = allItems.reduce<{
      [date: string]: {
        id: string;
        name: string;
        quantity: string;
        checked: boolean;
      }[];
    }>((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    setShoppingData(
      Object.entries(groupedItems).map(([date, items]) => ({date, items})),
    );
  }, [mealsDetails]);

  const toggleCheckBox = (id: string) => {
    setShoppingData(prevData =>
      prevData.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.id === id ? {...item, checked: !item.checked} : item,
        ),
      })),
    );
  };

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

  const renderItem = ({
    item,
  }: {
    item: {id: string; name: string; quantity: string; checked: boolean};
  }) => (
    <TouchableOpacity
      onPress={() => toggleCheckBox(item.id)}
      style={styles.itemContainer}>
      <CheckBox value={item.checked} onPress={() => toggleCheckBox(item.id)} />
      <CustomText style={[styles.itemText, item.checked && styles.checkedText]}>
        {item.name}
      </CustomText>
      <CustomText style={styles.quantityText}>{item.quantity}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Список продуктов</CustomText>
      <FlatList
        data={shoppingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.sectionContainer}>
            <CustomText style={styles.sectionTitle}>
              {formatDate(item.date)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
    marginBottom: 8,
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
