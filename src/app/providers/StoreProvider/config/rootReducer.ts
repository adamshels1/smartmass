import {combineReducers} from 'redux';
import authReducer from 'entities/auth/model/authSlice';
import mealReducer from 'entities/meal/model/slices/mealSlice.ts';
import userDetailsReducer from 'entities/userDetails/model/slices/userDetailsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  meal: mealReducer,
  userDetails: userDetailsReducer,
});

export default rootReducer;
