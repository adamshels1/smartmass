import React, {useState} from 'react';
import {View, StyleSheet, Button, TouchableOpacity, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';

const CalendarModal = ({
  visible,
  closeModal,
  onDateSelect,
  minDate,
  maxDate,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
    onDateSelect(date.dateString);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          <Calendar
            {...props}
            onDayPress={handleDateSelect}
            markedDates={selectedDate ? {[selectedDate]: {selected: true}} : {}}
            minDate={minDate}
            maxDate={maxDate}
            theme={{
              textDayFontFamily: 'Arial', // изменяем шрифт дней недели
              textMonthFontFamily: 'Arial', // изменяем шрифт названия месяца
            }}
          />
        </View>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CalendarModal;
