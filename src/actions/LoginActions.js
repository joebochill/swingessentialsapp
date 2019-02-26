import {AsyncStorage} from 'react-native';
/* Constants */
import {BASEURL, AUTH, failure, success, checkTimeout} from './actions';
import {getUserData, getSettings} from './UserDataActions';
import {getLessons, getCredits} from './LessonActions';
import {getTips} from './TipActions';
import {getPackages} from './PackageActions';
import * as Keychain from 'react-native-keychain';

export const LOGIN = {SUCCESS: 'LOGIN_SUCCESS', FAIL: 'LOGIN_FAIL'};
export const LOGOUT = {SUCCESS: 'LOGOUT_SUCCESS', FAIL: 'LOGOUT_FAIL'};
export const SET_TOKEN = {REQUEST: 'SET_TOKEN_REQUEST'};
export const REFRESH_TOKEN = {REQUEST: 'REFRESH_TOKEN', SUCCESS: 'REFRESH_TOKEN_SUCCESS', FAIL: 'REFRESH_TOKEN_FAIL'};
export const CHECK_TOKEN = {REQUEST: 'CHECK_TOKEN', SUCCESS: 'CHECK_TOKEN_SUCCESS', FAIL: 'CHECK_TOKEN_FAIL'};
export const DATA_FROM_TOKEN = {REQUEST: 'DATA_FROM_TOKEN', SUCCESS: 'DATA_FROM_TOKEN_SUCCESS', FAIL: 'DATA_FROM_TOKEN_FAIL'};


import {btoa, atob} from '../utils/base64.js';
import { ASYNC_PREFIX } from '../constants';
import { logLocalError } from '../utils/utils';

/* requests application data from a token after returning from background */
export function requestDataFromToken(token){
    return (dispatch) => {
        dispatch({type:DATA_FROM_TOKEN.REQUEST});
        dispatch(getUserData(token));
        dispatch(getLessons(token));
        dispatch(getCredits(token));
        // dispatch(getTips(token));
        // dispatch(getSettings(token));
    }
}

export function setToken(token){
    let exp = JSON.parse(atob(token.split('.')[1])).exp;
    if(exp < Date.now()/1000){
        AsyncStorage.removeItem(ASYNC_PREFIX+'token');
        return (dispatch) => {
            logLocalError('112: Local token expired');
        }
    }
    return (dispatch) => {
        dispatch({type:SET_TOKEN.REQUEST, data: token});
        dispatch(requestDataFromToken(token));
    }
}

/* submit username/pass credentials to get a auth token */
export function requestLogin(userCredentials){
    return (dispatch) => {
        return fetch(BASEURL+'login', { 
            headers: {
                [AUTH]: 'Basic ' + btoa(userCredentials.username) + '.' + btoa(userCredentials.password)
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    Keychain.setGenericPassword(userCredentials.username, userCredentials.password);
                    const token = response.headers.get('Token');
                    response.json()
                    .then((json) => dispatch(success(LOGIN.SUCCESS, {...json,token:token})));
                    AsyncStorage.setItem(ASYNC_PREFIX+'token', token);
                    dispatch(getLessons(token));
                    dispatch(getCredits(token));
                    dispatch(getSettings(token));
                    dispatch(getPackages(token));
                    break;
                default:
                    Keychain.resetGenericPassword();
                    //checkTimeout(response, dispatch);
                    dispatch(failure(LOGIN.FAIL, response));
                    break;
            }
        })
        .catch((error) => {
            logLocalError('113: Promise Error: logging in');
        });
    }
}

/* clears the current authentication token */
export function requestLogout(token){
    return (dispatch) => {
        return fetch(BASEURL+'logout', { 
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(LOGOUT.SUCCESS));
                    AsyncStorage.removeItem(ASYNC_PREFIX+'token');
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(LOGOUT.FAIL, response));
                    break;
            }
        })
        .catch((error) => {
            logLocalError('114: Promise Error: logging out');
        });
    }
}

// Submit a request to get a new token - users will be prompted prior to their session expiring
export function refreshToken(token){
    return (dispatch) => {
        fetch(BASEURL+'refresh', {
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    const token = response.headers.get('Token');
                    //localStorage.setItem('token', token);
                    dispatch(success(REFRESH_TOKEN.SUCCESS, {token: token}));
                    AsyncStorage.setItem(ASYNC_PREFIX+'token', token);
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REFRESH_TOKEN.FAIL, response));
            }
        })
        .catch((error) => {
            logLocalError('115: Promise Error: refreshing token');
        });
    }
}


// Check the token of a pending user to see if they have since been verified
export function checkToken(token){
    return (dispatch) => {
        fetch(BASEURL+'checkToken', {
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    const token = response.headers.get('Token');
                    if(token){
                        dispatch(success(CHECK_TOKEN.SUCCESS, {token: token}));
                    }
                    break;
                default:
                    checkTimeout(response, dispatch);
            }
        })
        .catch((error) => {
            logLocalError('116: Promise Error: checking token');
        });
    }
}

// Show (or hide) the token expiration warning modal
export function showLogoutWarning(show=true){
    return (dispatch) => {dispatch({type:show ? 'SHOW_LOGOUT_WARNING' : 'HIDE_LOGOUT_WARNING'});};
}