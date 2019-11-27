import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadTips() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_TIPS.REQUEST });

        HttpRequest.get('tips')
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_TIPS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_TIPS.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    }
}