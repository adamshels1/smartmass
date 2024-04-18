import React, { useState, useRef } from 'react';
import { Text, View, TextInput, Alert, Image, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import Input from '../components/Input';
import Header from '../components/Header';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsAction } from '../store/userActions';

// import Gemini from 'react-native-ai';

const { GoogleGenerativeAI } = require('@google/generative-ai');

//https://ai.google.dev/tutorials/get_started_node?hl=ru
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData)
  const [weight, setWeight] = useState(userData.weight);
  const [height, setHeight] = useState(userData.height);
  const [goal, setGoal] = useState('Набрать вес');
  const [allergies, setAllergies] = useState(userData.allergies);
  const [plan, setPlan] = useState('');
  const pickerRef = useRef(null);

  const disabled = weight && height && allergies
  const isHasSettingsData = userData.weight && userData.height && userData.goal && userData.allergies


  const onSave = () => {
    dispatch(setSettingsAction({
      weight: weight,
      height: height,
      goal: goal,
      allergies: allergies,
      plan: plan
    }))
    navigation.navigate('ChatScreen');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>

          <Header
            showBack={isHasSettingsData}
            title='Settings'
            navigation={navigation}
          />

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>

            <Input
              icon={require('../assets/icons/weight.png')}
              placeholder="Вес (кг)"
              keyboardType="numeric"
              value={weight}
              onChangeText={text => setWeight(text)}
            />


            <Input
              icon={require('../assets/icons/height.png')}
              placeholder="Рост (см)"
              keyboardType="numeric"
              value={height}
              onChangeText={text => setHeight(text)}
            />



            <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('../assets/icons/goal.png')} />

              <View style={{ width: Platform.OS === 'ios' ? 150 : 200, marginLeft:  Platform.OS === 'ios' ? 10 : 0, height: 40, justifyContent: 'center' }}>
                <RNPickerSelect
                  ref={pickerRef}
                  textInputProps={{
                    style: styles.input
                  }}
                  style={{
                    inputAndroid: styles.input
                  }}
                  selectedValue={goal}
                  onValueChange={value => setGoal(value)}
                  placeholder={{ label: 'Выберите цель', value: null }}
                  items={[
                    { label: 'Набрать вес', value: 'gain' },
                    { label: 'Сбросить вес', value: 'lose' },
                    { label: 'Поддерживать вес', value: 'maintain' },
                  ]}
                />
              </View>
              {Platform.OS === 'ios' && <Image style={[styles.inputIcon]} source={require('../assets/icons/chevron-right.png')} />}
            </View>


            <Input
              icon={require('../assets/icons/danger.png')}
              style={styles.input}
              placeholder="Аллергии (через запятую)"
              value={allergies}
              onChangeText={text => setAllergies(text)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="center"
            />

            <Button
              disabled={!disabled}
              onPress={onSave}
              title='Save'
            />

          </View>
        </View>
        <View style={{ height: Platform.OS === 'ios' ? 280 : 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;




const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 40,
    minHeight: 56,
    // Тень для Android
    elevation: 5,
    // Тень для iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 250
  },
  input: {
    color: '#3E423A',
    // margin: 10,
    fontSize: 14,
  },
  inputIcon: { width: 24, height: 24, marginLeft: 5, marginRight: 5 }
});