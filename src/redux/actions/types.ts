import { createAction } from './utilities';
import { Platform } from 'react-native';

/* Non-API actions */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';
export const INITIAL_LOAD = 'INITIAL_LOAD';

/* Login Actions */
export const LOGIN = createAction('LOGIN', 'login');
export const LOGOUT = createAction('LOGOUT', 'logout');
export const SET_TOKEN = createAction('SET_TOKEN', '');
export const CHECK_TOKEN = createAction('CHECK_TOKEN', 'checkToken');
export const REFRESH_TOKEN = createAction('REFRESH_TOKEN', 'refresh');

/* User Actions */
export const GET_USER_DATA = createAction('GET_USER_DATA', 'user');
export const SET_USER_DATA = createAction('SET_USER_DATA', 'details');
export const SET_USER_NOTIFICATIONS = createAction('SET_USER_NOTIFICATIONS', 'settings');
export const CHANGE_AVATAR = createAction('SET_USER_AVATAR', 'avatar');

/* Settings Actions */
export const GET_SETTINGS = createAction('GET_SETTINGS', 'settings');
export const PUT_SETTINGS = createAction('PUT_SETTINGS', 'settings');

/* Lesson Actions */
export const GET_LESSONS = createAction('GET_LESSONS', 'lessons');
export const SUBMIT_LESSON = createAction('SUBMIT_LESSON', 'redeem');
export const MARK_VIEWED = createAction('MARK_LESSON_VIEWED', 'viewed');

/* Tips Actions */
export const GET_TIPS = createAction('GET_TIPS', 'tips');

/* Blogs Actions */
export const GET_BLOGS = createAction('GET_BLOGS', 'blogs');

/* Package Actions */
export const GET_PACKAGES = createAction('GET_PACKAGES', 'packages');

/* Credits Actions */
export const GET_CREDITS = createAction('GET_CREDITS', 'credits');
export const PURCHASE_CREDITS = createAction(
    'PURCHASE_CREDITS',
    Platform.OS === 'android' ? 'executeandroidpayment' : 'executeiospayment',
);

/* FAQ Actions */
export const GET_FAQ = createAction('GET_FAQ', 'faq');
export const GET_CONFIG = createAction('GET_CONFIG', 'config');

/* Registration Actions */
export const CHECK_USERNAME = createAction('CHECK_USERNAME', 'checkUser');
export const CHECK_EMAIL = createAction('CHECK_EMAIL', 'checkEmail');
export const CREATE_ACCOUNT = createAction('CREATE_ACCOUNT', 'user');
export const RESET_PASSWORD_EMAIL = createAction('RESET_PASSWORD_EMAIL', 'reset');
export const VERIFY_EMAIL = createAction('VERIFY_EMAIL', 'verify');

/* Other Actions */
export const LOAD_LOGS = createAction('LOAD_LOGS', '');
export const SEND_LOGS = createAction('SEND_LOGS', 'logs');
export const MARK_TUTORIAL = { VIEWED: 'MARK_TUTORIAL_VIEWED', NEW: 'MARK_TUTORIAL_NEW' };
