import { GET_BLOGS, LOGOUT, TOKEN_TIMEOUT } from '../actions/types';
import { BlogsState } from '../../__types__';

const initialState: BlogsState = {
    loading: false,
    blogList: [],
};
export const blogsReducer = (state = initialState, action): BlogsState => {
    switch (action.type) {
        case GET_BLOGS.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_BLOGS.SUCCESS:
            return {
                loading: false,
                blogList: action.payload,
            };
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case TOKEN_TIMEOUT:
        case GET_BLOGS.FAILURE:
            // case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
