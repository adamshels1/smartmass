const initialState = {
  isBotWriting: false,
  selectedDate: null,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case 'SET_IS_BOT_WRITING':
      return {
        ...state,
        isBotWriting: payload,
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: payload,
      };
    default:
      return state;
  }
};
