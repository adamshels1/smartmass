import React, {useState} from 'react';
import {Text, View, TextInput, Button, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
// import Gemini from 'react-native-ai';

const {GoogleGenerativeAI} = require('@google/generative-ai');

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
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});

    const prompt = 'Что можно покушать на завтрак из того что я люблю';

    const result = await model.generateContent(JSON.stringify({prompt, context}));
    const response = await result.response;
    const text = response.text();
    console.log(text);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 24}}>Калькулятор питания</Text>

      <TextInput
        style={{width: 200, margin: 10}}
        placeholder="Вес (кг)"
        keyboardType="numeric"
        value={weight}
        onChangeText={text => setWeight(text)}
      />

      <TextInput
        style={{width: 200, margin: 10}}
        placeholder="Рост (см)"
        keyboardType="numeric"
        value={height}
        onChangeText={text => setHeight(text)}
      />

      <Picker
        selectedValue={goal}
        onValueChange={value => setGoal(value)}
        style={{width: 200, margin: 10}}>
        <Picker.Item label="Набрать вес" value="gain" />
        <Picker.Item label="Сбросить вес" value="lose" />
        <Picker.Item label="Поддерживать вес" value="maintain" />
      </Picker>

      <TextInput
        style={{width: 200, margin: 10}}
        placeholder="Аллергии (через запятую)"
        value={allergies}
        onChangeText={text => setAllergies(text)}
      />

      <Button title="Создать план питания" onPress={handleSubmit} />

      {plan && (
        <View style={{marginTop: 20}}>
          <Text>Ваш план питания:</Text>
          <Text>{plan}</Text>
        </View>
      )}
    </View>
  );
};

export default App;
