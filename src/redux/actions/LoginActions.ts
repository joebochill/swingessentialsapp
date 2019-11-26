import { http, btoa, handleResponse, success, failure } from '../../api/http-helper';
import * as ACTIONS from './types';
import { ASYNC_PREFIX, AUTH, BASEURL } from '../../constants';
// import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-community/async-storage';


export function requestLogin(userCredentials) {
    return (dispatch) => {
        return fetch(BASEURL+'login', { 
            headers: {
                [AUTH]: 'Basic ' + btoa(userCredentials.username) + '.' + btoa(userCredentials.password)
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    console.log('200 response');
                    // Keychain.setGenericPassword(userCredentials.username, userCredentials.password);
                    const token = response.headers.get('Token');
                    response.json()
                    .then((json) => dispatch(success(ACTIONS.LOGIN.SUCCESS, {...json,token:token})));
                    AsyncStorage.setItem(ASYNC_PREFIX+'token', token);
                    break;
                default:
                    // Keychain.resetGenericPassword();
                    //checkTimeout(response, dispatch);
                    console.log('bad request')
                    dispatch({type: ACTIONS.LOGIN.FAILURE});
                    break;
            }
        })
        .catch((error) => {
            // logLocalError('113: Promise Error: logging in');
            console.log('login fetch failed');
        });
    }
}
/* clears the current authentication token */
export function requestLogout(token){
    console.log('logout request');
    return (dispatch) => {
        return fetch(BASEURL+'logout', { 
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    console.log('good response');
                    dispatch(success(ACTIONS.LOGOUT.SUCCESS));
                    AsyncStorage.removeItem(ASYNC_PREFIX+'token');
                    break;
                default:
                    // checkTimeout(response, dispatch);
                    console.log('unable to logout');
                    dispatch(failure(ACTIONS.LOGOUT.FAILURE, response));
                    break;
            }
        })
        .catch((error) => {
            // logLocalError('114: Promise Error: logging out');
            console.log('promise error');
        });
    }
}