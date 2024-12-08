import {persistReducer} from 'redux-persist';
import rootReducer from './rootReducer';
import persistConfig from './persistConfig';

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
