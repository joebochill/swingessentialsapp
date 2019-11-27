import { createAction } from './utilities';

/* Non-API actions */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';

/* Login Actions */
export const LOGIN = createAction('LOGIN', 'login');
export const LOGOUT = createAction('LOGOUT', 'logout');

/* Lesson Actions */
export const GET_LESSONS = createAction('GET_LESSONS', 'lessons')

/* Tips Actions */
export const GET_TIPS = createAction('GET_TIPS', 'tips')
