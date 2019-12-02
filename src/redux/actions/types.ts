import { createAction } from './utilities';
import { Platform } from 'react-native';

/* Non-API actions */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';
export const INITIAL_LOAD = 'INITIAL_LOAD';

/* Login Actions */
export const LOGIN = createAction('LOGIN', 'login');
export const LOGOUT = createAction('LOGOUT', 'logout');

/* User Actions */
export const GET_USER_DATA = createAction('GET_USER_DATA', 'user');

/* Lesson Actions */
export const GET_LESSONS = createAction('GET_LESSONS', 'lessons');

/* Tips Actions */
export const GET_TIPS = createAction('GET_TIPS', 'tips');

/* Blogs Actions */
export const GET_BLOGS = createAction('GET_BLOGS', 'blogs');

/* Package Actions */
export const GET_PACKAGES = createAction('GET_PACKAGES', 'packages');

/* Credits Actions */
export const GET_CREDITS = createAction('GET_CREDITS', 'credits');
export const PURCHASE_CREDITS = createAction('PURCHASE_CREDITS', Platform.OS === 'android' ? 'executeandroidpayment' : 'executeiospayment');