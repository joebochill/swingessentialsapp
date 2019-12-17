import { LOGIN, LOGOUT, SET_TOKEN } from '../redux/actions/types';

export let TOKEN = null;
function _setToken(newToken) {
    TOKEN = newToken;
}

export const saveAuthToken = store => next => action => {
    if (action.type === LOGIN.SUCCESS || action.type === SET_TOKEN.REQUEST) {
        _setToken(action.payload.token);
    } 
    else if (action.type === LOGOUT.SUCCESS || action.type === LOGOUT.FAILURE || action.type === LOGIN.FAILURE) {
        _setToken(null);
    }
    // continue processing this action
    return next(action);
};
