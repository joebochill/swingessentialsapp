import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadFAQ() {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.GET_FAQ.REQUEST });

        void HttpRequest.get(ACTIONS.GET_FAQ.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_FAQ.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_FAQ.FAILURE, response, 'LoadFAQ'));
            })
            .request();
    };
}

export function loadPlaceholder() {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.GET_CONFIG.REQUEST });

        void HttpRequest.get(ACTIONS.GET_CONFIG.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_CONFIG.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_CONFIG.FAILURE, response, 'LoadConfig'));
            })
            .request();
    };
}
