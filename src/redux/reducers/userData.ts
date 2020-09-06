import { LOGIN, LOGOUT, GET_USER_DATA, TOKEN_TIMEOUT } from '../actions/types';
import { UserDataState } from '../../__types__';

const initialState: UserDataState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone: '',
    joined: 0,
};
export const userDataReducer = (state = initialState, action): UserDataState => {
    switch (action.type) {
        case GET_USER_DATA.SUCCESS:
        case LOGIN.SUCCESS:
            return {
                ...state,
                username: action.payload.personal.username,
                firstName: action.payload.personal.first_name,
                lastName: action.payload.personal.last_name,
                email: action.payload.personal.email,
                location: action.payload.personal.location,
                phone: action.payload.personal.phone,
                joined: action.payload.personal.joined,
            };
        case GET_USER_DATA.FAILURE:
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case TOKEN_TIMEOUT:
            return {
                ...state,
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                joined: 0,
            };
        default:
            return state;
    }
};
