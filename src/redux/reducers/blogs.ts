import { GET_BLOGS, LOGOUT } from "../actions/types";

const initialState = {
    loading: false,
    blogList: []
}
export const blogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BLOGS.REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_BLOGS.SUCCESS:
            return {
                loading: false,
                blogList: action.payload
            }
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case GET_BLOGS.FAILURE:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
}