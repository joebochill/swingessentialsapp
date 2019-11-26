import { LOGIN, LOGOUT } from '../actions/types';

const initialLoginState = {
    token: null,
    admin: false,
    modalWarning: false,
    failCount: 0
};

export const loginReducer = (state = initialLoginState, action) => {
    switch (action.type) {
        case LOGIN.SUCCESS:
            console.log('login success');
            return {
                ...state,
                modalWarning: false,
                failCount: 0,
                token: action.payload.token,
                //admin: (JSON.parse(atob(action.data.token.split('.')[1]))['role'].toLowerCase() === 'administrator')
            };
        case LOGIN.FAILURE:
            return {
                ...state,
                token: null,
                admin: false,
                failCount: state.failCount + 1
            };
        case LOGOUT.SUCCESS:
            return { ...state,
                token: null,
                admin: false,
                failCount: 0
            }
        default:
            return state;
    }
}