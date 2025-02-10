import {combineReducers} from 'redux';
import authReducer from 'entities/auth/model/authSlice';
import mealReducer from 'entities/meal/model/slices/mealSlice.ts';
import userDetailsReducer from 'entities/userDetails/model/slices/userDetailsSlice';
import referralsReducer from 'features/referrals/model/slices/referralsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  meal: mealReducer,
  userDetails: userDetailsReducer,
  referrals: referralsReducer,
});

export default rootReducer;
