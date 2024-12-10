import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Checkbox, Button} from 'react-native-paper';

const ingredients = [
  {id: '1', name: 'Бекон', checked: false},
  {id: '2', name: 'Броколи', checked: false},
  {id: '3', name: 'Бурый рис', checked: false},
  {id: '4', name: 'Говядина', checked: true},
  {id: '5', name: 'Изюм', checked: false},
];

const App = () => {
  const [data, setData] = useState(ingredients);
  const [selectedTab, setSelectedTab] = useState('AI'); // Для переключателей

  const toggleCheckbox = id => {
    setData(prevState =>
      prevState.map(item =>
        item.id === id ? {...item, checked: !item.checked} : item,
      ),
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={item.checked ? 'checked' : 'unchecked'}
        onPress={() => toggleCheckbox(item.id)}
        color="#31D6D6"
      />
      <Text style={styles.checkboxLabel}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Получить диету на этот день</Text>
        <TouchableOpacity>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Переключатели */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'AI' && styles.activeTab]}
          onPress={() => setSelectedTab('AI')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'AI' && styles.activeTabText,
            ]}>
            Предпочтения AI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'MyProducts' && styles.activeTab]}
          onPress={() => setSelectedTab('MyProducts')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'MyProducts' && styles.activeTabText,
            ]}>
            Мои продукты
          </Text>
        </TouchableOpacity>
      </View>

      {/* Текст */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        convallis interdum velit. In et ex quis dolor egestas consectetur. Donec
        sagittis dolor purus, ac suscipit enim bibendum dictum.
      </Text>

      {/* Список с чекбоксами */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {/* Кнопка подтверждения */}
      <Button
        mode="contained"
        onPress={() => console.log('Confirmed!')}
        style={styles.confirmButton}
        buttonColor="#31D6D6"
        textColor="#FFFFFF">
        Подтвердить
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#888',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#E8FDFD',
    borderColor: '#31D6D6',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#31D6D6',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  list: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default App;
