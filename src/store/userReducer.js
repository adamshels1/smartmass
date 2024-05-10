import moment from 'moment';

const initialState = {
  isSignedIn: false,
  userName: 'Conan',
  weight: null,
  height: null,
  goal: null,
  allergies: [],
  likedDishes: [],
  diet: null,
  calories: null,
  maxMealPerDay: null,
  dailyMealStartTime: null,
  dailyMealEndTime: null,
  preferredProducts: null,
  //dailyData
  mealtimes: [],
  messages: [],
  step: 0,
  days: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: payload,
      };
    case 'SET_SETTINGS':
      console.log('SET_SETTINGS', payload);
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
      console.log('SET_DIET', payload);

      const updatedDays2 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, diet: payload.diet} : day;
      });

      console.log('updatedDays2', updatedDays2);

      return {
        ...state,
        days: updatedDays2,
      };
    case 'SET_MEALTIMES':
      console.log('SET_MEALTIMES', payload);

      const updatedDays3 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, mealtimes: payload.mealtimes} : day;
      });
      console.log('updatedDays3', updatedDays3);
      return {
        ...state,
        days: updatedDays3,
      };
    case 'SET_CALORIES':
      console.log('SET_CALORIES', payload);
      return {
        ...state,
        calories: payload,
      };
    case 'SET_MESSAGES':
      const found = state.days?.find(day =>
        moment(day.date).isSame(payload.date, 'day'),
      );

      console.log('foundToday', found);
      console.log('payload', payload);

      const updatedDays = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, messages: payload.messages} : day;
      });

      console.log('updatedDays', updatedDays);

      if (!found) {
        updatedDays.push({
          date: payload.date,
          messages: payload.messages,
        });
      }

      console.log('updatedDays2', updatedDays);

      return {
        ...state,
        days: updatedDays,
      };
    case 'SET_STEP':
      console.log('SET_STEP', payload);
      const updatedDays4 = state.days?.map(day => {
        const isSameDay = moment(day.date).isSame(payload.date, 'day');
        return isSameDay ? {...day, step: payload.step} : day;
      });
      console.log('updatedDays4', updatedDays4);
      return {
        ...state,
        days: updatedDays4,
      };
    case 'CLEAR_DAYS':
      return {
        ...state,
        days: [],
      };
    default:
      return state;
  }
};
