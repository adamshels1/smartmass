import {combineReducers} from 'redux';
import authReducer from 'features/Auth/model/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
