/* Constants */
import {BASEURL, AUTH, failure, success, checkTimeout} from './actions.js';
import { logLocalError } from '../utils/utils.js';

export const GET_USER_DATA = {SUCCESS: 'GET_USER_DATA_SUCCESS', FAIL: 'GET_USER_DATA_FAIL'};
export const GET_SETTINGS = {SUCCESS: 'GET_SETTINGS_SUCCESS', FAIL: 'GET_SETTINGS_FAIL'};
export const PUT_SETTINGS = {SUCCESS: 'PUT_SETTINGS_SUCCESS', FAIL: 'PUT_SETTINGS_FAIL'};

/* Retrieves user personal data from the database */
export function getUserData(token){
    return (dispatch) => {
        return fetch(BASEURL+'user', { 
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_USER_DATA.SUCCESS, json)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_USER_DATA.FAIL, response));
                    break;
            }
        })
        .catch((error) => {
            logLocalError('124: Promise Error: getting user data');
        });
    }
}

/* Retrieves user app settings from the database */
export function getSettings(token){
    return (dispatch) => {
        return fetch(BASEURL+'settings', { 
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_SETTINGS.SUCCESS, json)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_SETTINGS.FAIL, response));
                    break;
            }
        })
        .catch((error) => {
            logLocalError('125: Promise Error: getting settings');
        });
    }
}

/* Updates the user settings in the database */
export function putSettings(data, token){
    return (dispatch) => {
        return fetch(BASEURL+'settings', { 
            method: 'PUT',
            headers: {
                [AUTH]: 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(PUT_SETTINGS.SUCCESS));
                    dispatch(getSettings(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(PUT_SETTINGS.FAIL, response));
                    dispatch(getSettings(token));
                    break;
            }
        })
        .catch((error) => {
            logLocalError('126: Promise Error: updating settings');
        });
    }
}