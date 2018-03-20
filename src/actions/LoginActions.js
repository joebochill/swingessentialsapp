/* Constants */
import {BASEURL, failure, success, checkTimeout} from './actions';
import {getUserData, getSettings} from './UserDataActions';
import {getLessons, getCredits} from './LessonActions';
import {getPackages} from './PackageActions';

export const LOGIN = {SUCCESS: 'LOGIN_SUCCESS', FAIL: 'LOGIN_FAIL'};
export const LOGOUT = {SUCCESS: 'LOGOUT_SUCCESS', FAIL: 'LOGOUT_FAIL'};
export const REFRESH_TOKEN = {REQUEST: 'REFRESH_TOKEN', SUCCESS: 'REFRESH_TOKEN_SUCCESS', FAIL: 'REFRESH_TOKEN_FAIL'};

import {btoa} from '../utils/base64.js';

/* submit username/pass credentials to get a auth token */
export function requestLogin(userCredentials){
    return (dispatch) => {
        return fetch(BASEURL+'login', { 
            headers: {
                'Authorization': 'Basic ' + btoa(userCredentials.username) + '.' + btoa(userCredentials.password)
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    const token = response.headers.get('Token');
                    response.json()
                    .then((json) => dispatch(success(LOGIN.SUCCESS, {...json,token:token})))
                    .then(() => dispatch(getLessons(token)))
                    .then(() => dispatch(getCredits(token)))
                    .then(() => dispatch(getSettings(token)))
                    .then(() => dispatch(getPackages(token)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(LOGIN.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* clears the current authentication token */
export function requestLogout(token){
    return (dispatch) => {
        return fetch(BASEURL+'logout', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(LOGOUT.SUCCESS));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(LOGOUT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

// Submit a request to get a new token - users will be prompted prior to their session expiring
export function refreshToken(token){
    return (dispatch) => {
        fetch(BASEURL+'refresh', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    const token = response.headers.get('Token');
                    localStorage.setItem('token', token);
                    dispatch(success(REFRESH_TOKEN.SUCCESS, {token: token}));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REFRESH_TOKEN.FAIL, response));
            }
        })
        .catch((error) => console.error(error));
    }
}