import { GET_PACKAGES, LOGOUT } from "../actions/types";

const initialState = {
    list: [],
    loading: false,
}
export const packagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PACKAGES.REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_PACKAGES.SUCCESS:
            return {
                loading: false,
                list: action.payload
            }
        case GET_PACKAGES.FAILURE:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
}