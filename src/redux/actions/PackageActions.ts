import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadPackages() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_PACKAGES.REQUEST });

        HttpRequest.get(ACTIONS.GET_PACKAGES.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_PACKAGES.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_PACKAGES.FAILURE, response, 'LoadPackages'));
            })
            .request();
    };
}
