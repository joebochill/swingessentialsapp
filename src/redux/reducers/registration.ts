import { CREATE_ACCOUNT, CHECK_USERNAME, CHECK_EMAIL, VERIFY_EMAIL } from '../actions/types';
import { RegistrationState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: RegistrationState = {
    pending: false,
    userAvailable: true,
    emailAvailable: true,
    success: false,
    emailVerified: false,
    error: 0,
};
export const registrationReducer = (state = initialState, action: ReducerAction): RegistrationState => {
    switch (action.type) {
        case CREATE_ACCOUNT.REQUEST:
            return {
                ...state,
                pending: true,
                success: false,
            };
        case CREATE_ACCOUNT.SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
            };
        case CREATE_ACCOUNT.FAILURE:
            return {
                ...state,
                pending: false,
                success: false,
            };
        case CHECK_USERNAME.SUCCESS:
            return {
                ...state,
                userAvailable: action.payload.available,
            };
        case CHECK_EMAIL.SUCCESS:
            return {
                ...state,
                emailAvailable: action.payload.available,
            };
        case VERIFY_EMAIL.REQUEST:
            return {
                ...state,
                pending: true,
                emailVerified: false,
                error: 0,
            };
        case VERIFY_EMAIL.SUCCESS:
            return {
                ...state,
                pending: false,
                emailVerified: true,
                error: 0,
            };
        case VERIFY_EMAIL.FAILURE:
            return {
                ...state,
                pending: false,
                emailVerified: false,
                // @ts-ignore
                error: isNaN(parseInt(action.error, 10)) ? -1 : parseInt(action.error, 10),
            };
        default:
            return state;
    }
};
