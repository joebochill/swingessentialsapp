import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadPros() {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.GET_PROS.REQUEST });

        void HttpRequest.get(ACTIONS.GET_PROS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_PROS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_PROS.FAILURE, response, 'loadPros'));
            })
            .request();
    };
}
