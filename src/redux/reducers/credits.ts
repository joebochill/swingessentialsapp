import { GET_CREDITS, LOGOUT } from '../actions/types';

const initialState = {
    count: 0,
    unlimited: 0,
    unlimitedExpires: 0,
    inProgress: false,
    success: false,
    fail: false
};
export const creditsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CREDITS.REQUEST:
            return {
                ...state,
                inProgress: true
            };
        case GET_CREDITS.SUCCESS:
            return {
                ...state,
                inProgress: false,
                count: parseInt(action.payload.count, 10) || 0,
                unlimited: action.payload.unlimited_count,
                unlimitedExpires: parseInt(action.payload.unlimited_expires, 10) || 0
            };
        case GET_CREDITS.FAILURE:
        case LOGOUT.SUCCESS:
        // case TOKEN_TIMEOUT:
            return {
                ...state,
                inProgress: false,
                count: 0,
                unlimited: 0,
                unlimitedExpires: 0
            };
        // case EXECUTE_PAYMENT.REQUEST:
        //     return {
        //         ...state,
        //         inProgress: true,
        //         success: false,
        //         fail: false
        //     }
        // case EXECUTE_PAYMENT.SUCCESS:
        //     return {
        //         ...state,
        //         inProgress: false,
        //         success: true,
        //         fail: false
        //     }
        // case EXECUTE_PAYMENT.FAIL:
        //     return {
        //         ...state,
        //         inProgress: false,
        //         success: false,
        //         fail: true
        //     }
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