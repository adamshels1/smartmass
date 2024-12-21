import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import CheckBox from './Checkbox.tsx';

const shoppingData = [
  {
    date: '18 ноября, Понедельник',
    items: [
      {id: '1', name: 'Бекон', quantity: '4 ломтика', checked: true},
      {id: '2', name: 'Броколи', quantity: '100 гр.', checked: false},
      {id: '3', name: 'Бурый рис', quantity: '150 гр.', checked: false},
      {id: '4', name: 'Говядина', quantity: '200 гр.', checked: true},
    ],
  },
  {
    date: '19 ноября, Вторник',
    items: [
      {id: '5', name: 'Картофель', quantity: '2 шт.', checked: false},
      {id: '6', name: 'Куриная грудка', quantity: '250 гр.', checked: false},
      {id: '7', name: 'Лапша', quantity: '50 гр.', checked: true},
      {id: '8', name: 'Лосось', quantity: '250 гр.', checked: true},
      {id: '9', name: 'Лук репчатый', quantity: '50 гр.', checked: false},
      {id: '10', name: 'Масло оливковое', quantity: '1 ст.л.', checked: false},
    ],
  },
  {
    date: '20 ноября, Среда',
    items: [
      {id: '11', name: 'Овсяные хлопья', quantity: '30 гр.', checked: false},
    ],
  },
];

const Cart = () => {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <CheckBox value={item.checked} />
      <Text style={[styles.itemText, item.checked && styles.checkedText]}>
        {item.name}
      </Text>
      <Text style={styles.quantityText}>{item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список продуктов</Text>
      <Text style={styles.subtitle}>Продукты по дням</Text>
      <FlatList
        data={shoppingData}
        keyExtractor={item => item.date}
        renderItem={({item}) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.date}</Text>
            <FlatList
              data={item.items}
              keyExtractor={subItem => subItem.id}
              renderItem={renderItem}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Подтвердить покупку</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
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
