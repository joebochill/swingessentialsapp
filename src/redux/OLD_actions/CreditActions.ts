import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';

export function loadCredits() {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.GET_CREDITS.REQUEST });

        void HttpRequest.get(ACTIONS.GET_CREDITS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_CREDITS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_CREDITS.FAILURE, response, 'LoadCredits'));
            })
            .request();
    };
}

/* Hands the payment processing over to the server */
export function purchaseCredits(
    data: { receipt: string; package: string },
    onSuccess: (body: any) => void | Promise<void>,
    onFailure: (response: Response) => void | Promise<void>
) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: ACTIONS.PURCHASE_CREDITS.REQUEST });
        void HttpRequest.put(ACTIONS.PURCHASE_CREDITS.API)
            .withBody(data)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.PURCHASE_CREDITS.SUCCESS, body));
                void onSuccess(body);
                dispatch(loadCredits());
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.PURCHASE_CREDITS.FAILURE, response, 'PurchaseCredits'));
                void onFailure(response);
            })
            .request();
    };
}
