import { LOGIN, LOGOUT, SET_TOKEN, TOKEN_TIMEOUT, REFRESH_TOKEN, CREATE_ACCOUNT } from '../redux/actions/types';
import AsyncStorage from '@react-native-community/async-storage';
import { ASYNC_PREFIX } from '../constants';

export let TOKEN: string | null = null;
function _setToken(newToken: string | null) {
    TOKEN = newToken;
}

export const saveAuthToken = (store) => (next) => (action) => {
    if (
        action.type === LOGIN.SUCCESS ||
        action.type === SET_TOKEN.REQUEST ||
        action.type === REFRESH_TOKEN.SUCCESS ||
        action.type === CREATE_ACCOUNT.SUCCESS
    ) {
        _setToken(action.payload.token);
        if (action.payload.token !== null) AsyncStorage.setItem(`${ASYNC_PREFIX}token`, action.payload.token);
        else AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
    } else if (
        action.type === LOGOUT.SUCCESS ||
        action.type === LOGOUT.FAILURE ||
        action.type === LOGIN.FAILURE ||
        action.type === TOKEN_TIMEOUT
    ) {
        _setToken(null);
        AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
    }
    // continue processing this action
    return next(action);
};
