import { LOGIN, LOGOUT } from '../actions/types';

const initialLoginState = {
    token: null,
    admin: false,
    modalWarning: false,
    failCount: 0,
    pending: false,
};

export const loginReducer = (state = initialLoginState, action) => {
    switch (action.type) {
        case LOGIN.REQUEST:
            return {
                ...state,
                pending: true,
            };
        case LOGIN.SUCCESS:
            return {
                ...state,
                modalWarning: false,
                failCount: 0,
                token: action.payload.token,
                pending: false,
                //admin: (JSON.parse(atob(action.data.token.split('.')[1]))['role'].toLowerCase() === 'administrator')
            };
        case LOGIN.FAILURE:
            return {
                ...state,
                token: null,
                admin: false,
                pending: false,
                failCount: state.failCount + 1
            };
        case LOGOUT.SUCCESS:
            return {
                ...state,
                token: null,
                admin: false,
                pending: false,
                failCount: 0
            }
        default:
            return state;
    }
}