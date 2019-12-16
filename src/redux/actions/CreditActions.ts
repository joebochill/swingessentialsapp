import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';

export function loadCredits() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_CREDITS.REQUEST });

        HttpRequest.get(ACTIONS.GET_CREDITS.API)
            .onSuccess((body: any) => {
                console.log('success');
                dispatch(success(ACTIONS.GET_CREDITS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_CREDITS.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    };
}

/* Hands the payment processing over to the server */
export function purchaseCredits(data, onSuccess, onFailure) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.PURCHASE_CREDITS.REQUEST });
        HttpRequest.put(ACTIONS.PURCHASE_CREDITS.API)
            .withBody(data)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.PURCHASE_CREDITS.SUCCESS, body));
                onSuccess(body);
                dispatch(loadCredits());
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.PURCHASE_CREDITS.FAILURE, response));
                onFailure(response);
                console.log(response.headers.get('Error'));
            })
            .request();
    };
}
