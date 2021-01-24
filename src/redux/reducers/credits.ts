import { GET_CREDITS, LOGOUT, PURCHASE_CREDITS, TOKEN_TIMEOUT } from '../actions/types';
import { CreditsState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: CreditsState = {
    count: 0,
    inProgress: false,
    success: false,
    fail: false,
};
export const creditsReducer = (state = initialState, action: ReducerAction): CreditsState => {
    switch (action.type) {
        case GET_CREDITS.REQUEST:
            return {
                ...state,
                success: false,
                fail: false,
                inProgress: true,
            };
        case GET_CREDITS.SUCCESS:
            return {
                ...state,
                inProgress: false,
                count: parseInt(action.payload.count, 10) || 0,
            };
        case GET_CREDITS.FAILURE:
        case LOGOUT.SUCCESS:
        case TOKEN_TIMEOUT:
            return {
                ...state,
                inProgress: false,
                count: 0,
            };
        case PURCHASE_CREDITS.REQUEST:
            return {
                ...state,
                inProgress: true,
                success: false,
                fail: false,
            };
        case PURCHASE_CREDITS.SUCCESS:
            return {
                ...state,
                inProgress: false,
                success: true,
                fail: false,
            };
        case PURCHASE_CREDITS.FAILURE:
            return {
                ...state,
                inProgress: false,
                success: false,
                fail: true,
            };
        default:
            return state;
    }
};
