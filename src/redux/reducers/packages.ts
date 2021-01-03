import { GET_PACKAGES, TOKEN_TIMEOUT } from '../actions/types';
import { PackagesState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: PackagesState = {
    list: [],
    loading: false,
};
export const packagesReducer = (state = initialState, action: ReducerAction): PackagesState => {
    switch (action.type) {
        case GET_PACKAGES.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_PACKAGES.SUCCESS:
            return {
                loading: false,
                list: action.payload,
            };
        case GET_PACKAGES.FAILURE:
        case TOKEN_TIMEOUT:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
