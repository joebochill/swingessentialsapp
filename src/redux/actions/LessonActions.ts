import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

// TODO: Mark lessons as viewed

export function loadLessons() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_LESSONS.REQUEST });

        HttpRequest.get(ACTIONS.GET_LESSONS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_LESSONS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_LESSONS.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    }
}