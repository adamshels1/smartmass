import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Agenda} from 'react-native-calendars';

const AgendaComponent = props => {
  const [items, setItems] = useState({
    '2024-04-26': [{name: 'Item 1 - any js object'}],
    '2024-04-27': [{name: 'Item 2 - any js object'}],
    '2024-04-28': [],
  });

  const renderItem = item => {
    return (
      <View
        style={{backgroundColor: 'white', padding: 20, borderBottomWidth: 1}}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <Agenda
      minDate={new Date()}
      // onDayPress={() => alert(3)}
      items={{}}
      // renderItem={item => renderItem(item)}
      // renderEmptyDate={() => (
      //   <View>
      //     <Text>No items for this day</Text>
      //   </View>
      // )}
    />
  );
};

export default AgendaComponent;
