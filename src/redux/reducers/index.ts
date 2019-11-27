import { combineReducers } from 'redux';
import { loginReducer } from './authentication';
import { lessonsReducer } from './lessons';
import { tipsReducer } from './tips';

export const AppReducer = combineReducers({
    login: loginReducer,
    lessons: lessonsReducer,
    tips: tipsReducer,
});