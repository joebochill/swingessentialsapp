import { LOGOUT, GET_FAQ, TOKEN_TIMEOUT } from '../actions/types';
import { FAQState } from '../../__types__';

const initialState: FAQState = {
    loading: false,
    questions: [],
};
export const faqReducer = (state = initialState, action): FAQState => {
    switch (action.type) {
        case GET_FAQ.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_FAQ.SUCCESS:
            return {
                loading: false,
                questions: action.payload,
            };
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case GET_FAQ.FAILURE:
        case TOKEN_TIMEOUT:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
