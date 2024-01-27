import { GET_PROS } from '../OLD_actions/types';
import { ProsState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: ProsState = {
    prosList: [],
};
export const prosReducer = (state = initialState, action: ReducerAction): ProsState => {
    switch (action.type) {
        case GET_PROS.SUCCESS:
            return {
                ...state,
                prosList: action.payload,
            };
        default:
            return state;
    }
};
