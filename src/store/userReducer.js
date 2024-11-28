import moment from 'moment';
import {sortByTime} from '../utils/sort';

const initialState = {
  isSignedIn: false,
  userName: 'Conan',
  weight: null,
  height: null,
  weightChangeGoal: null,
  goal: null,
  allergies: [],
  likedDishes: [],
  diet: null,
  calories: null,
  maxMealPerDay: null,
  dailyMealStartTime: null,
  dailyMealEndTime: null,
  preferredProducts: null,
  age: null,
  gender: null,
  //dailyData
  mealtimes: [],
  messages: [],
  step: 0,
  days: [],
  cart: [],
  tooltipStep: 'showGetCaloriesButton', //showGetCaloriesButton | showGetRationButton | showNexDayButton  | showCartButton
  showWelcomeScreen: true,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: payload,
      };
    case 'SET_SETTINGS':
      // console.log('SET_SETTINGS', payload);
      return {
        ...state,
        weight: payload.weight,
        height: payload.height,
        goal: payload.goal,
        allergies: payload.allergies,
        preferredProducts: payload.preferredProducts,
        dailyMealStartTime: payload.dailyMealStartTime,
        dailyMealEndTime: payload.dailyMealEndTime,
        maxMealPerDay: payload.maxMealPerDay,
      };
    case 'SET_DIET':
      // console.log('SET_DIET', payload);

      const sortedDiet = sortByTime(payload.diet);
      const updatedDays2 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay
          ? {...day, diet: sortedDiet, products: payload.products}
          : day;
      });

      // console.log('updatedDays2', updatedDays2);

      return {
        ...state,
        days: updatedDays2,
      };

    case 'SET_IS_VISIBLE_CHANGE_PART_DIET':
      // console.log('SET_DIET', payload);

      const updatedDays5 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay
          ? {...day, isVisibleChangePartDiet: payload.visible}
          : day;
      });

      return {
        ...state,
        days: updatedDays5,
      };

    case 'SET_CHANGE_PART_DIET_RESULTS':
      // console.log('SET_DIET', payload);

      const updatedDays6 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay
          ? {...day, changePartDietResults: payload.changePartDietResults}
          : day;
      });

      return {
        ...state,
        days: updatedDays6,
      };

    case 'SET_MEALTIMES':
      // console.log('SET_MEALTIMES', payload);

      const updatedDays3 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, mealtimes: payload.mealtimes} : day;
      });
      // console.log('updatedDays3', updatedDays3);
      return {
        ...state,
        days: updatedDays3,
      };
    case 'SET_CALORIES':
      // console.log('SET_CALORIES', payload);
      return {
        ...state,
        calories: payload,
      };
    case 'SET_MESSAGES':
      const found = state.days?.find(day =>
        moment(day.date).isSame(payload.date, 'day'),
      );

      // console.log('foundToday', found);
      // console.log('payload', payload);

      const updatedDays = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, messages: payload.messages} : day;
      });

      // console.log('updatedDays', updatedDays);

      if (!found) {
        updatedDays.push({
          date: payload.date,
          messages: payload.messages,
        });
      }

      // console.log('updatedDays2', updatedDays);

      return {
        ...state,
        days: updatedDays,
      };
    case 'SET_STEP':
      // console.log('SET_STEP', payload);
      const updatedDays4 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, step: payload.step} : day;
      });
      // console.log('updatedDays4', updatedDays4);
      return {
        ...state,
        days: updatedDays4,
      };
    case 'CLEAR_DAYS':
      return {
        ...state,
        days: [],
      };
    case 'SET_CART':
      console.log('set_cart', payload);

      return {
        ...state,
        cart: payload,
      };
    case 'SET_TOOLTIP_STEP':
      return {
        ...state,
        tooltipStep: payload,
      };
    case 'SET_SHOW_WELCOME_SCREEN':
      return {
        ...state,
        showWelcomeScreen: payload,
      };
    default:
      return state;
  }
};
