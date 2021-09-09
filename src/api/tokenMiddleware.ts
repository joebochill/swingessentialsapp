import { LOGIN, LOGOUT, SET_TOKEN, TOKEN_TIMEOUT, REFRESH_TOKEN, CREATE_ACCOUNT } from '../redux/actions/types';
import AsyncStorage from '@react-native-community/async-storage';
import { ASYNC_PREFIX } from '../constants';
import { Middleware } from 'redux';

export let TOKEN: string | null = null;
function setToken(newToken: string | null): void {
    TOKEN = newToken;
}

export const saveAuthToken: Middleware =
    (/*store*/) =>
    (next) =>
    (action): any => {
        if (
            action.type === LOGIN.SUCCESS ||
            action.type === SET_TOKEN.REQUEST ||
            action.type === REFRESH_TOKEN.SUCCESS ||
            action.type === CREATE_ACCOUNT.SUCCESS
        ) {
            setToken(action.payload.token);
            if (action.payload.token !== null) void AsyncStorage.setItem(`${ASYNC_PREFIX}token`, action.payload.token);
            else void AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
        } else if (
            action.type === LOGOUT.SUCCESS ||
            action.type === LOGOUT.FAILURE ||
            action.type === LOGIN.FAILURE ||
            action.type === TOKEN_TIMEOUT
        ) {
            setToken(null);
            void AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
        }
        // continue processing this action
        return next(action);
    };
