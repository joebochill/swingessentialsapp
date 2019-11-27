import { success, failure } from '../../api/http-helper';
import { btoa } from '../../utilities/btoa';
import * as ACTIONS from './types';
import { ASYNC_PREFIX, AUTH, BASEURL } from '../../constants';
// import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-community/async-storage';
import { loadLessons, loadTips } from './index';

export function requestLogin(userCredentials) {
    return (dispatch) => {
        dispatch({type: ACTIONS.LOGIN.REQUEST});
        return fetch(BASEURL+'/' + ACTIONS.LOGIN.API, { 
            headers: {
                [AUTH]: 'Basic ' + btoa(userCredentials.username) + '.' + btoa(userCredentials.password)
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    // Keychain.setGenericPassword(userCredentials.username, userCredentials.password);
                    const token = response.headers.get('Token');
                    response.json()
                    .then((json) => {
                        dispatch(success(ACTIONS.LOGIN.SUCCESS, {...json,token:token}));
                    })
                    .then(() => {
                        dispatch(loadLessons());
                        dispatch(loadTips());
                    });
                    AsyncStorage.setItem(ASYNC_PREFIX+'token', token);
                    break;
                default:
                    // Keychain.resetGenericPassword();
                    //checkTimeout(response, dispatch);
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
    return (dispatch) => {
        return fetch(BASEURL+'/'+ ACTIONS.LOGOUT.API, { 
            headers: {
                [AUTH]: 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(ACTIONS.LOGOUT.SUCCESS));
                    AsyncStorage.removeItem(ASYNC_PREFIX+'token');
                    break;
                default:
                    // checkTimeout(response, dispatch);
                    dispatch(failure(ACTIONS.LOGOUT.FAILURE, response));
                    break;
            }
        })
        .catch((error) => {
            // logLocalError('114: Promise Error: logging out');
            console.log('logout fetch failed');
        });
    }
}