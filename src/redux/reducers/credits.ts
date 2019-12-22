import { GET_CREDITS, LOGOUT, PURCHASE_CREDITS, TOKEN_TIMEOUT } from '../actions/types';
import { CreditsState } from '../../__types__';

const initialState: CreditsState = {
    count: 0,
    // unlimited: 0,
    // unlimitedExpires: 0,
    inProgress: false,
    success: false,
    fail: false,
};
export const creditsReducer = (state = initialState, action): CreditsState => {
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
                // unlimited: action.payload.unlimited_count,
                // unlimitedExpires: parseInt(action.payload.unlimited_expires, 10) || 0
            };
        case GET_CREDITS.FAILURE:
        case LOGOUT.SUCCESS:
        case TOKEN_TIMEOUT:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                inProgress: false,
                count: 0,
                // unlimited: 0,
                // unlimitedExpires: 0
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
        // case 'Navigation/NAVIGATE':
        //     return {
        //         ...state,
        //         success: false,
        //         fail: false
        //     };
        default:
            return state;
    }
};
