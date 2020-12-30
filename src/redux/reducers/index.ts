import { combineReducers } from 'redux';
import { loginReducer } from './authentication';
import { lessonsReducer } from './lessons';
import { tipsReducer } from './tips';
import { userDataReducer } from './userData';
import { creditsReducer } from './credits';
import { blogsReducer } from './blogs';
import { packagesReducer } from './packages';
import { settingsReducer } from './settings';
import { registrationReducer } from './registration';
import { faqReducer } from './faq';
import { logsReducer } from './logs';
import { tutorialReducer } from './tutorials';
import { configReducer } from './config';

export const AppReducer = combineReducers({
    login: loginReducer,
    lessons: lessonsReducer,
    tips: tipsReducer,
    userData: userDataReducer,
    config: configReducer,
    credits: creditsReducer,
    blogs: blogsReducer,
    packages: packagesReducer,
    settings: settingsReducer,
    registration: registrationReducer,
    faq: faqReducer,
    logs: logsReducer,
    tutorials: tutorialReducer,
});
