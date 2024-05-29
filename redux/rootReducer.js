// rootReducer.js
import { combineReducers } from 'redux';
import customerAuthReducer from './customerAuthReducer';
import shopOwnerAuthReducer from './shopOwnerAuthReducer';
import LanguageReducer from './LanguageReducer';

const rootReducer = combineReducers({
  customerAuth: customerAuthReducer,
  shopOwnerAuth: shopOwnerAuthReducer,
  appLanguage: LanguageReducer
});

export default rootReducer;
