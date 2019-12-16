import { GET_LESSONS, LOGOUT, SUBMIT_LESSON } from '../actions/types';
import { LessonsState } from '../../__types__';

const initialState: LessonsState = {
    loading: false,
    pending: [],
    closed: [],
    redeemPending: false,
    redeemSuccess: false,
    redeemError: null,
};

export const lessonsReducer = (state = initialState, action): LessonsState => {
    switch (action.type) {
        case GET_LESSONS.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_LESSONS.SUCCESS:
            return {
                ...state,
                loading: false,
                pending: action.payload.pending,
                closed: action.payload.closed,
            };
        case GET_LESSONS.FAILURE:
            return {
                ...state,
                loading: false,
            };
        case LOGOUT.SUCCESS:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
                pending: [],
                closed: [],
            };
        case SUBMIT_LESSON.REQUEST:
            return {
                ...state,
                redeemPending: true,
                redeemSuccess: false,
                redeemError: null,
            };
        case SUBMIT_LESSON.SUCCESS:
            return {
                ...state,
                redeemPending: false,
                redeemSuccess: true,
                redeemError: null,
            };
        case SUBMIT_LESSON.FAILURE:
            return {
                ...state,
                redeemPending: false,
                redeemSuccess: false,
                redeemError: parseInt(action.error, 10),
            };
        // case 'Navigation/NAVIGATE':
        //     return {
        //         ...state,
        //         redeemPending: false,
        //         redeemSuccess: false,
        //     };
        default:
            return state;
    }
};
