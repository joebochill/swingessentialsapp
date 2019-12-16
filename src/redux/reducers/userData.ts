import { LOGIN, LOGOUT, GET_USER_DATA } from '../actions/types';
import { UserDataState } from '../../__types__';

// TODO: put a join date in the DB and API
const initialState: UserDataState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
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
            };
        case GET_USER_DATA.FAILURE:
        case LOGOUT.SUCCESS:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                username: '',
                firstName: '',
                lastName: '',
                email: '',
            };
        default:
            return state;
    }
};
