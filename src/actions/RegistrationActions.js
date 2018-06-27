/* Constants */
import {BASEURL, failure, success, checkTimeout} from './actions.js';
import {getUserData, getSettings} from './UserDataActions.js';
import {getLessons, getCredits} from './LessonActions.js';

export const CREATE_ACCOUNT = {REQUEST: 'CREATE_ACCOUNT', SUCCESS: 'CREATE_ACCOUNT_SUCCESS', FAIL: 'CREATE_ACCOUNT_FAIL'};
export const REQUEST_RESET = {REQUEST: 'REQUEST_RESET', SUCCESS: 'REQUEST_RESET_SUCCESS', FAIL: 'REQUEST_RESET_FAIL'};
export const CHECK_USER = {REQUEST: 'CHECK_USER', SUCCESS: 'CHECK_USER_SUCCESS', FAIL:'CHECK_USER_FAIL'};
export const CHECK_EMAIL = {REQUEST: 'CHECK_EMAIL', SUCCESS: 'CHECK_EMAIL_SUCCESS', FAIL:'CHECK_EMAIL_FAIL'};
export const VERIFY_EMAIL = {REQUEST: 'VERIFY_EMAIL', SUCCESS: 'VERIFY_EMAIL_SUCCESS', FAIL: 'VERIFY_EMAIL_FAIL'};


/* Check if a requested username is available */
export function checkUsernameAvailability(username){
    return (dispatch) => {
        return fetch(BASEURL+'checkUser?username='+encodeURIComponent(username))
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json)=>dispatch(success(CHECK_USER.SUCCESS, {...json, lastChecked: username})));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(CHECK_USER.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Check if an email address is already registered */
export function checkEmailAvailability(email){
    return (dispatch) => {
        return fetch(BASEURL+'checkEmail?email='+encodeURIComponent(email))
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json)=>dispatch(success(CHECK_EMAIL.SUCCESS, {...json, lastChecked: email})));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(CHECK_EMAIL.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Creates a new (tentative) user account */
export function createAccount(data){
    return (dispatch) => {
        if(Object.keys(data).length < 1){return;}
        dispatch({type: CREATE_ACCOUNT.REQUEST});
        
        return fetch(BASEURL+'user', { 
            method: 'PUT',
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(CREATE_ACCOUNT.SUCCESS,{token: response.headers.get('Token')}));
                    const token = response.headers.get('Token');
                    dispatch(getUserData(token));
                    dispatch(getLessons(token));
                    dispatch(getCredits(token));
                    dispatch(getSettings(token));
                    break;
                default:
                    //checkTimeout(response, dispatch);
                    dispatch(failure(CREATE_ACCOUNT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Requests a password reset for the account linked to the supplied email address */
export function requestReset(data){
    return (dispatch) => {
        fetch(BASEURL+'reset', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(REQUEST_RESET.SUCCESS));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REQUEST_RESET.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Lets the database know that a user has verified his email address
and is now a full, verified user */
export function verifyEmail(code){   
    return (dispatch) => {
        
        dispatch({type: VERIFY_EMAIL.REQUEST});

        return fetch(BASEURL+'verify', { 
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({type:'email',code: code})
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(VERIFY_EMAIL.SUCCESS));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(VERIFY_EMAIL.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}