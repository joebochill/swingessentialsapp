import { GET_LESSONS, LOGOUT } from "../actions/types";
import { LessonsState } from "../../__types__";

const initialState: LessonsState = {
    loading: false,
    pending: [],
    closed: [],
    redeemPending: false,
    redeemSuccess: false,
}

export const lessonsReducer = (state = initialState, action): LessonsState => {
    switch (action.type) {
        case GET_LESSONS.REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_LESSONS.SUCCESS:
            return {
                ...state,
                loading: false,
                pending: action.payload.pending,
                closed: action.payload.closed
            };
        case GET_LESSONS.FAILURE:
            return {
                ...state,
                loading: false,
                selected: null
            };
        case LOGOUT.SUCCESS:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
                pending: [],
                closed: [],
                selected: null
            };
        // case REDEEM_CREDIT.REQUEST:
        //     return {
        //         ...state,
        //         redeemPending: true,
        //         redeemSuccess: false
        //     };
        // case REDEEM_CREDIT.SUCCESS:
        //     return {
        //         ...state,
        //         redeemPending: false,
        //         redeemSuccess: true
        //     };
        // case REDEEM_CREDIT.FAIL:
        //     return {
        //         ...state,
        //         redeemPending: false,
        //         redeemSuccess: false
        //     };
        // case 'Navigation/NAVIGATE':
        //     return {
        //         ...state,
        //         redeemPending: false,
        //         redeemSuccess: false,
        //     };
        default:
            return state;
    }
}