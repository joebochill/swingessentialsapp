import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadCredits() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_CREDITS.REQUEST });

        HttpRequest.get(ACTIONS.GET_CREDITS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_CREDITS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_CREDITS.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    }
}