import { LOAD_LOGS } from '../actions/types';
import { LogsState } from '../../__types__';

const initialState: LogsState = {
    loading: false,
};
export const logsReducer = (state = initialState, action): LogsState => {
    switch (action.type) {
        case LOAD_LOGS.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case LOAD_LOGS.SUCCESS:
        case LOAD_LOGS.FAILURE:
            return {
                loading: false,
            };
        default:
            return state;
    }
};
