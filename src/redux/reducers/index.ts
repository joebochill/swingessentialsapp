import { combineReducers } from 'redux';
import { loginReducer } from './authentication';
import { lessonsReducer } from './lessons';
import { tipsReducer } from './tips';
import { userDataReducer } from './userData';

export const AppReducer = combineReducers({
    login: loginReducer,
    lessons: lessonsReducer,
    tips: tipsReducer,
    userData: userDataReducer,
});