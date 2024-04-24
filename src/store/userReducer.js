const initialState = {
  isSignedIn: false,
  userName: 'Conan',
  weight: null,
  height: null,
  goal: null,
  allergies: [],
  likedDishes: [],
  diet: null,
  mealtimes: [],
  calories: null,
  messages: [],
  step: 0,
  maxMealPerDay: null,
  dailyMealStartTime: null,
  dailyMealEndTime: null,
  preferredProducts: null,
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
      return {
        ...state,
        diet: payload,
      };
    case 'SET_MEALTIMES':
      console.log('SET_MEALTIMES', payload);
      return {
        ...state,
        mealtimes: payload,
      };
    case 'SET_CALORIES':
      console.log('SET_CALORIES', payload);
      return {
        ...state,
        calories: payload,
      };
    case 'SET_MESSAGES':
      console.log('SET_MESSAGES', payload);
      return {
        ...state,
        messages: payload,
      };
    case 'SET_STEP':
      console.log('SET_STEP', payload);
      return {
        ...state,
        step: payload,
      };
    default:
      return state;
  }
};
