import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadFAQ() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_FAQ.REQUEST });

        HttpRequest.get(ACTIONS.GET_FAQ.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_FAQ.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_FAQ.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    };
}
