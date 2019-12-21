import { success, failure } from '../../api/http-helper';
import { btoa, atob } from '../../utilities';
import * as ACTIONS from './types';
import { ASYNC_PREFIX, AUTH, BASEURL } from '../../constants';
// import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-community/async-storage';
import { loadLessons } from './LessonActions';
import { loadTips } from './TipActions';
import { loadCredits } from './CreditActions';
import { loadBlogs } from './BlogActions';
import { loadSettings } from './SettingsActions';
import { ThunkDispatch } from 'redux-thunk';
import { Credentials } from '../../__types__';
import { HttpRequest } from '../../api/http';

// TODO: Implement the token timeout warning
// TODO: Handle fetch failure (on login esp) more gracefully
// TODO: timer to check pending users registration status update

export function requestLogin(userCredentials: Credentials) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.LOGIN.REQUEST });
        return fetch(BASEURL + '/' + ACTIONS.LOGIN.API, {
            headers: {
                [AUTH]: 'Basic ' + btoa(userCredentials.username) + '.' + btoa(userCredentials.password),
            },
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        // Keychain.setGenericPassword(userCredentials.username, userCredentials.password);
                        const token = response.headers.get('Token');
                        response
                            .json()
                            .then(json => {
                                dispatch(success(ACTIONS.LOGIN.SUCCESS, { ...json, token: token }));
                            })
                            .then(() => {
                                dispatch(loadUserContent());

                                // TODO: Load more stuff
                            });
                        AsyncStorage.setItem(ASYNC_PREFIX + 'token', token);
                        break;
                    default:
                        // Keychain.resetGenericPassword();
                        //checkTimeout(response, dispatch);
                        dispatch({ type: ACTIONS.LOGIN.FAILURE });
                        break;
                }
            })
            .catch(error => {
                // logLocalError('113: Promise Error: logging in');
                console.log('login fetch failed');
            });
    };
}
/* clears the current authentication token */
export function requestLogout(token: string) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        return fetch(BASEURL + '/' + ACTIONS.LOGOUT.API, {
            headers: {
                [AUTH]: 'Bearer ' + token,
            },
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        dispatch(success(ACTIONS.LOGOUT.SUCCESS));
                        AsyncStorage.removeItem(ASYNC_PREFIX + 'token');
                        dispatch(loadTips());
                        break;
                    default:
                        // checkTimeout(response, dispatch);
                        AsyncStorage.removeItem(ASYNC_PREFIX + 'token');
                        dispatch(failure(ACTIONS.LOGOUT.FAILURE, response));
                        break;
                }
            })
            .catch(error => {
                // logLocalError('114: Promise Error: logging out');
                console.log('logout fetch failed');
            });
    };
}

export function refreshToken(){
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.REFRESH_TOKEN.REQUEST });
        HttpRequest.get(ACTIONS.REFRESH_TOKEN.API)
            .withFullResponse()
            .onSuccess((response: any) => {
                const token = response.headers.get('Token');
                dispatch(success(ACTIONS.REFRESH_TOKEN.SUCCESS, {token}));
                AsyncStorage.setItem(ASYNC_PREFIX+'token', token);
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.REFRESH_TOKEN.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    };
}

export function setToken(token: string) {
    return (dispatch: ThunkDispatch<any, void, any>) => {

        let exp = JSON.parse(atob(token.split('.')[1])).exp;
        if (exp < Date.now() / 1000) {
            AsyncStorage.removeItem(ASYNC_PREFIX + 'token');
            // logLocalError('112: Local token expired');
            console.log('Local token expired');
        }
        dispatch({ type: ACTIONS.SET_TOKEN.REQUEST, payload: { token } });
        dispatch(loadUserContent());
    }
}

export function loadUserContent() {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        // dispatch({type:DATA_FROM_TOKEN.REQUEST});
        dispatch(loadLessons());
        dispatch(loadCredits());
        dispatch(loadSettings());
        dispatch(loadTips());
        dispatch(loadBlogs());
    }
}