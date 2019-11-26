import { combineReducers } from 'redux';
import { loginReducer } from './authentication';

export const AppReducer = combineReducers({
    login: loginReducer
});