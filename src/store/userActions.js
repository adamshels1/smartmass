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

export const setDietAction = (diet, products, date) => {
  return {
    type: 'SET_DIET',
    payload: {diet, products, date},
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
  console.log('setStepAction', step);
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

export const setCart = cart => {
  return {
    type: 'SET_CART',
    payload: cart,
  };
};

export const setTooltipStep = value => {
  return {
    type: 'SET_TOOLTIP_STEP',
    payload: value,
  };
};

export const setShowWelcomeScreen = bool => {
  return {
    type: 'SET_SHOW_WELCOME_SCREEN',
    payload: bool,
  };
};

export const setIsVisibleChangePartDiet = (visible, date) => {
  return {
    type: 'SET_IS_VISIBLE_CHANGE_PART_DIET',
    payload: {visible, date},
  };
};

export const setChangePartDietResults = (changePartDietResults, date) => {
  return {
    type: 'SET_CHANGE_PART_DIET_RESULTS',
    payload: {changePartDietResults, date},
  };
};
