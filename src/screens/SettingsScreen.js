import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Input from '../components/Input';
import Header from '../components/Header';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {setSettingsAction} from '../store/userActions';
import i18n from '../shared/config/i18n';
import {getDailyDiets} from 'entities/chat/model/services/getDailyDiets/getDailyDiets';
import {changeDailyDietOne} from 'entities/chat/model/services/getAnotherDailyDiet/getAnotherDailyDiet';

const {GoogleGenerativeAI} = require('@google/generative-ai');

//https://ai.google.dev/tutorials/get_started_node?hl=ru
// Доступ к вашему API-ключу как к переменной среды (см. "Настройте свой API-ключ" выше)
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

const SettingsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [weight, setWeight] = useState(userData.weight);
  const [height, setHeight] = useState(userData.height);
  const [goal, setGoal] = useState(userData.goal);
  const [dailyMealStartTime, setDailyMealStartTime] = useState(
    userData.dailyMealStartTime,
  );
  const [dailyMealEndTime, setDailyMealEndTime] = useState(
    userData.dailyMealEndTime,
  );
  const [maxMealPerDay, setMaxMealPerDay] = useState(userData.maxMealPerDay);
  const [allergies, setAllergies] = useState(userData.allergies);
  const [preferredProducts, setPreferredProducts] = useState(
    userData.preferredProducts,
  );

  const pickerRef = useRef(null);
  const pickerRefGoal = useRef(null);
  const pickerRefMealStart = useRef(null);
  const pickerRefMealEnd = useRef(null);
  const pickerRefMaxMeal = useRef(null);

  const disabled = weight && height && allergies;
  const isHasSettingsData =
    userData.weight &&
    userData.height &&
    userData.goal &&
    userData.allergies &&
    userData.dailyMealStartTime &&
    userData.dailyMealEndTime &&
    userData.maxMealPerDay;

  const onSave = () => {
    dispatch(
      setSettingsAction({
        weight: weight,
        height: height,
        goal: goal,
        allergies: allergies,
        preferredProducts: preferredProducts,
        dailyMealStartTime: dailyMealStartTime,
        dailyMealEndTime: dailyMealEndTime,
        maxMealPerDay: maxMealPerDay,
      }),
    );
    navigation.navigate('ChatScreen');
  };

  return (
    <View style={{paddingTop: 100}}>
      <TouchableOpacity onPress={getDailyDiets}>
        <Text>get diet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <Header
            showBack={isHasSettingsData}
            title={i18n.t('Settings')}
            navigation={navigation}
          />

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => pickerRefGoal?.current?.togglePicker()}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputIcon}
                  source={require('../assets/icons/goal.png')}
                />

                <View
                  style={{
                    width: Platform.OS === 'ios' ? 150 : 200,
                    marginLeft: Platform.OS === 'ios' ? 10 : 0,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <RNPickerSelect
                    ref={pickerRefGoal}
                    textInputProps={{
                      style: styles.input,
                    }}
                    style={{
                      inputAndroid: styles.input,
                    }}
                    selectedValue={goal}
                    value={goal}
                    onValueChange={value => setGoal(value)}
                    placeholder={{label: i18n.t('Select goal'), value: null}}
                    items={[
                      {label: i18n.t('Gain weight'), value: 'gain'},
                      {label: i18n.t('Lose weight'), value: 'lose'},
                      {label: i18n.t('Maintain weight'), value: 'maintain'},
                    ]}
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <Image
                    style={[styles.inputIcon]}
                    source={require('../assets/icons/chevron-right.png')}
                  />
                )}
              </View>
            </TouchableHighlight>

            <Input
              icon={require('../assets/icons/weight.png')}
              placeholder={i18n.t('Weight (kg)')}
              keyboardType="numeric"
              value={weight}
              onChangeText={text => setWeight(text)}
            />
            <Input
              icon={require('../assets/icons/height.png')}
              placeholder={i18n.t('Height (cm)')}
              keyboardType="numeric"
              value={height}
              onChangeText={text => setHeight(text)}
            />

            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => pickerRefMealStart?.current?.togglePicker()}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputIcon}
                  source={require('../assets/icons/start.png')}
                />

                <View
                  style={{
                    width: Platform.OS === 'ios' ? 150 : 200,
                    marginLeft: Platform.OS === 'ios' ? 10 : 0,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <RNPickerSelect
                    ref={pickerRefMealStart}
                    textInputProps={{
                      style: styles.input,
                    }}
                    style={{
                      inputAndroid: styles.input,
                    }}
                    selectedValue={dailyMealStartTime}
                    value={dailyMealStartTime}
                    onValueChange={value => setDailyMealStartTime(value)}
                    placeholder={{
                      label: i18n.t('Meal start time'),
                      value: null,
                    }}
                    items={[
                      {label: '6:00', value: '6:00'},
                      {label: '6:30', value: '6:30'},
                      {label: '7:00', value: '7:00'},
                      {label: '7:30', value: '7:30'},
                      {label: '8:00', value: '8:00'},
                      {label: '8:30', value: '8:30'},
                      {label: '9:00', value: '9:00'},
                      {label: '9:30', value: '9:30'},
                      {label: '10:00', value: '10:00'},
                      {label: '10:30', value: '10:30'},
                      {label: '11:00', value: '11:00'},
                      {label: '11:30', value: '11:30'},
                      {label: '12:00', value: '12:00'},
                    ]}
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <Image
                    style={[styles.inputIcon]}
                    source={require('../assets/icons/chevron-right.png')}
                  />
                )}
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => pickerRefMealEnd?.current?.togglePicker()}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputIcon}
                  source={require('../assets/icons/time-left.png')}
                />

                <View
                  style={{
                    width: Platform.OS === 'ios' ? 150 : 200,
                    marginLeft: Platform.OS === 'ios' ? 10 : 0,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <RNPickerSelect
                    ref={pickerRefMealEnd}
                    textInputProps={{
                      style: styles.input,
                    }}
                    style={{
                      inputAndroid: styles.input,
                    }}
                    selectedValue={dailyMealEndTime}
                    value={dailyMealEndTime}
                    onValueChange={value => setDailyMealEndTime(value)}
                    placeholder={{
                      label: i18n.t('Meal end time'),
                      value: null,
                    }}
                    items={[
                      {label: '17:00', value: '17:00'},
                      {label: '17:30', value: '17:30'},
                      {label: '18:00', value: '18:00'},
                      {label: '18:30', value: '18:30'},
                      {label: '19:00', value: '19:00'},
                      {label: '19:30', value: '19:30'},
                      {label: '20:00', value: '20:00'},
                      {label: '20:30', value: '20:30'},
                      {label: '21:00', value: '21:00'},
                      {label: '21:30', value: '21:30'},
                      {label: '22:00', value: '22:00'},
                      {label: '22:30', value: '22:30'},
                      {label: '23:00', value: '23:00'},
                    ]}
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <Image
                    style={[styles.inputIcon]}
                    source={require('../assets/icons/chevron-right.png')}
                  />
                )}
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => pickerRefMaxMeal?.current?.togglePicker()}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputIcon}
                  source={require('../assets/icons/eating.png')}
                />

                <View
                  style={{
                    width: Platform.OS === 'ios' ? 150 : 200,
                    marginLeft: Platform.OS === 'ios' ? 10 : 0,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <RNPickerSelect
                    ref={pickerRefMaxMeal}
                    textInputProps={{
                      style: styles.input,
                    }}
                    style={{
                      inputAndroid: styles.input,
                    }}
                    selectedValue={maxMealPerDay}
                    value={maxMealPerDay}
                    onValueChange={value => setMaxMealPerDay(value)}
                    placeholder={{
                      label: i18n.t('Number of meals per day'),
                      value: null,
                    }}
                    items={[
                      {label: '1', value: '1'},
                      {label: '2', value: '2'},
                      {label: '3', value: '3'},
                      {label: '4', value: '4'},
                      {label: '5', value: '5'},
                      {label: '6', value: '6'},
                      {label: '7', value: '7'},
                    ]}
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <Image
                    style={[styles.inputIcon]}
                    source={require('../assets/icons/chevron-right.png')}
                  />
                )}
              </View>
            </TouchableHighlight>

            <Input
              icon={require('../assets/icons/no-food.png')}
              style={styles.input}
              placeholder={i18n.t('Exclude foods')}
              value={allergies}
              onChangeText={text => setAllergies(text)}
              // multiline={true}
              numberOfLines={4}
              textAlignVertical="center"
            />
            <Input
              icon={require('../assets/icons/healthy-food.png')}
              style={styles.input}
              placeholder={i18n.t('Preferred products, dishes')}
              value={preferredProducts}
              onChangeText={text => setPreferredProducts(text)}
              // multiline={true}
              numberOfLines={4}
              textAlignVertical="center"
            />
            <Button
              disabled={!disabled}
              onPress={onSave}
              title={i18n.t('Save')}
            />
          </View>
        </View>
        <View style={{height: Platform.OS === 'ios' ? 280 : 50}} />
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
    width: 250,
  },
  input: {
    color: '#3E423A',
    // margin: 10,
    fontSize: 14,
  },
  inputIcon: {width: 24, height: 24, marginLeft: 5, marginRight: 5},
});
