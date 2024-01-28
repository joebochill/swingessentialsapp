import { LOGIN, LOGOUT, GET_USER_DATA, TOKEN_TIMEOUT, CREATE_ACCOUNT } from '../actions/types';
import { UserDataState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: UserDataState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    birthday: '',
    average: undefined,
    goals: '',
    // phone: '',
    joined: 0,
};
export const userDataReducer = (state = initialState, action: ReducerAction): UserDataState => {
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
                birthday: action.payload.personal.birthday,
                average: action.payload.personal.average,
                goals: action.payload.personal.goals,
                // phone: action.payload.personal.phone,
                joined: action.payload.personal.joined,
            };
        case CREATE_ACCOUNT.SUCCESS:
            return {
                ...state,
                username: action.payload.personal.username,
                email: action.payload.personal.email,
                joined: Date.now() / 1000,
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
                birthday: '',
                average: undefined,
                goals: '',
                email: '',
                joined: 0,
            };
        default:
            return state;
    }
};
