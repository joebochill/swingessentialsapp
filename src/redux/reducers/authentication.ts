import { LOGIN, LOGOUT, CREATE_ACCOUNT, SET_TOKEN, REFRESH_TOKEN, TOKEN_TIMEOUT } from '../actions/types';
import { getUserRole } from '../../utilities';
import { LoginState } from '../../__types__';

const initialState: LoginState = {
    token: null,
    admin: false,
    role: 'anonymous',
    modalWarning: false,
    failCount: 0,
    pending: false,
};

export const loginReducer = (state = initialState, action): LoginState => {
    switch (action.type) {
        case LOGIN.REQUEST:
        case REFRESH_TOKEN.REQUEST:
            return {
                ...state,
                pending: true,
            };
        case LOGIN.SUCCESS:
        case CREATE_ACCOUNT.SUCCESS:
        case SET_TOKEN.REQUEST:
        case REFRESH_TOKEN.SUCCESS:
            return {
                ...state,
                modalWarning: false,
                failCount: 0,
                token: action.payload.token,
                pending: false,
                role: getUserRole(action.payload.token),
            };
        case LOGIN.FAILURE:
            return {
                ...state,
                token: null,
                admin: false,
                pending: false,
                role: 'anonymous',
                failCount: state.failCount + 1,
            };
        case REFRESH_TOKEN.FAILURE:
            return {
                ...state,
                pending: false,
            };
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case TOKEN_TIMEOUT:
            return {
                ...state,
                token: null,
                admin: false,
                pending: false,
                role: 'anonymous',
                failCount: 0,
            };
        default:
            return state;
    }
};
