export const loginAction = () => {
  return {
    type: 'LOGIN',
    payload: true,
  };
};

export const logoutAction = () => {
  return {
    type: 'LOGIN',
    payload: false,
  };
};

export const setSettingsAction = ({
  weight,
  height,
  goal,
  allergies,
  likedDishes,
  dailyMealStartTime,
  dailyMealEndTime,
  maxMealPerDay,
  preferredProducts,
}) => {
  return {
    type: 'SET_SETTINGS',
    payload: {
      weight,
      height,
      goal,
      allergies,
      likedDishes,
      dailyMealStartTime,
      dailyMealEndTime,
      maxMealPerDay,
      preferredProducts,
    },
  };
};

export const setDietAction = (diet, date) => {
  return {
    type: 'SET_DIET',
    payload: {diet, date},
  };
};

export const setMealtimesAction = (mealtimes, date) => {
  return {
    type: 'SET_MEALTIMES',
    payload: {mealtimes, date},
  };
};

export const setCalories = calories => {
  return {
    type: 'SET_CALORIES',
    payload: calories,
  };
};

export const setMessagesAction = (messages, date) => {
  return {
    type: 'SET_MESSAGES',
    payload: {
      messages,
      date,
    },
  };
};

export const setStepAction = (step, date) => {
  return {
    type: 'SET_STEP',
    payload: {step, date},
  };
};

export const clearDays = () => {
  return {
    type: 'CLEAR_DAYS',
  };
};
