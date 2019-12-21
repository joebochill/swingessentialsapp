import { HttpRequest } from '../../api/http';
import { success, failure, xhrfailure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';
import { ThunkDispatch } from 'redux-thunk';

// TODO: Mark lessons as viewed
// TODO: Only allow submission if they have credits available
// TODO: Only allow submission if no pending lessons

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
    };
}

/* Lets a user redeem a credit and submit a new lesson request */
export function submitLesson(data: FormData, onUpdateProgress: (this: XMLHttpRequest, ev: ProgressEvent) => any) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.SUBMIT_LESSON.REQUEST });

        HttpRequest.post(ACTIONS.SUBMIT_LESSON.API)
            .withBody(data, false)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.SUBMIT_LESSON.SUCCESS, body));
                dispatch(loadLessons());
            })
            .onFailure((response: Response) => {
                dispatch(xhrfailure(ACTIONS.SUBMIT_LESSON.FAILURE, response));
                console.log(response && response.getResponseHeader ? response.getResponseHeader('Error') : 'N/A');
            })
            .requestWithProgress(onUpdateProgress);
    };
}
