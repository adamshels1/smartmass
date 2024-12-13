import {combineReducers} from 'redux';
import authReducer from 'features/Auth/model/authSlice';
import mealReducer from 'entities/meal/model/slices/mealSlice.ts';

const rootReducer = combineReducers({
  auth: authReducer,
  meal: mealReducer,
});

export default rootReducer;
