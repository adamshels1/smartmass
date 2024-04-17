import React, { useState, useRef } from 'react';
import { Text, View, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import Input from './src/components/Input'

// import Gemini from 'react-native-ai';

const { GoogleGenerativeAI } = require('@google/generative-ai');

//https://ai.google.dev/tutorials/get_started_node?hl=ru
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

const App = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [allergies, setAllergies] = useState('');
  const [plan, setPlan] = useState('');


  const handleSubmit = async () => {
    const context = {
      weight: parseFloat(weight), // Assuming weight is a number
      height: parseFloat(height), // Assuming height is a number
      goal,
      allergies: ['свинина'],
      likedDishes: ['Блины'], // Add an empty array for liked dishes
    };

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'Что можно покушать на завтрак из того что я люблю';

    const result = await model.generateContent(JSON.stringify({ prompt, context }));
    const response = await result.response;
    const text = response.text();
    console.log(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


        <Input
          icon={require('./src/assets/icons/weight.png')}
          placeholder="Вес (кг)"
          keyboardType="numeric"
          value={weight}
          onChangeText={text => setWeight(text)}
        />


        <Input
          icon={require('./src/assets/icons/height.png')}
          placeholder="Рост (см)"
          keyboardType="numeric"
          value={height}
          onChangeText={text => setHeight(text)}
        />



        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('./src/assets/icons/goal.png')} />
          <RNPickerSelect
            textInputProps={{
              style: [styles.input] // Применяем стили к тексту
            }}
            selectedValue={goal}
            onValueChange={value => setGoal(value)}
            items={[
              { label: 'Набрать вес', value: 'gain' },
              { label: 'Сбросить вес', value: 'lose' },
              { label: 'Поддерживать вес', value: 'maintain' },
            ]}
          />
          <Image style={[styles.inputIcon]} source={require('./src/assets/icons/chevron-right.png')} />
        </View>


        <Input
          icon={require('./src/assets/icons/danger.png')}
          style={styles.input}
          placeholder="Аллергии (через запятую)"
          value={allergies}
          onChangeText={text => setAllergies(text)}
        />


        <TouchableOpacity style={{ width: 250, height: 56, borderRadius: 40, backgroundColor: '#31D6D6', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Сохранить</Text>
        </TouchableOpacity>



        {/* <Text style={{ fontSize: 24 }}>Калькулятор питания</Text>

      <TextInput
        style={{ width: 200, margin: 10 }}
        placeholder="Вес (кг)"
        keyboardType="numeric"
        value={weight}
        onChangeText={text => setWeight(text)}
      />

      <TextInput
        style={{ width: 200, margin: 10 }}
        placeholder="Рост (см)"
        keyboardType="numeric"
        value={height}
        onChangeText={text => setHeight(text)}
      />

      <Picker
        selectedValue={goal}
        onValueChange={value => setGoal(value)}
        style={{ width: 200, margin: 10 }}>
        <Picker.Item label="Набрать вес" value="gain" />
        <Picker.Item label="Сбросить вес" value="lose" />
        <Picker.Item label="Поддерживать вес" value="maintain" />
      </Picker>

      <RNPickerSelect
        style={{ width: 200, margin: 10 }}
        selectedValue={goal}
        onValueChange={value => setGoal(value)}
        items={[
          { label: 'Набрать вес', value: 'gain' },
          { label: 'Сбросить вес', value: 'lose' },
          { label: 'Поддерживать вес', value: 'maintain' },
        ]}
      />

      <TextInput
        style={{ width: 200, margin: 10 }}
        placeholder="Аллергии (через запятую)"
        value={allergies}
        onChangeText={text => setAllergies(text)}
      />

      <Button title="Создать план питания" onPress={handleSubmit} />

      {plan && (
        <View style={{ marginTop: 20 }}>
          <Text>Ваш план питания:</Text>
          <Text>{plan}</Text>
        </View>
      )} */}

    </KeyboardAvoidingView>
  );
};

export default App;




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

    margin: 10,
    fontSize: 14,
  },
  inputIcon: { width: 24, height: 24, marginLeft: 5, marginRight: 5 }
});