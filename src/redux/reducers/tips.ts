import { GET_TIPS, LOGOUT } from "../actions/types";
import { TipsState } from "../../__types__";

const initialState: TipsState = {
    loading: false,
    tipList: []
}
export const tipsReducer = (state = initialState, action): TipsState => {
    switch (action.type) {
        case GET_TIPS.REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_TIPS.SUCCESS:
            return {
                loading: false,
                tipList: action.payload
            }
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case GET_TIPS.FAILURE:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
}