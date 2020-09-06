import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import * as ACTIONS from './types';

import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';

export function loadUserInfo() {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: ACTIONS.GET_BLOGS.REQUEST });

        HttpRequest.get(ACTIONS.GET_USER_DATA.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_USER_DATA.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_USER_DATA.FAILURE, response, 'userData'));
            })
            .request();
    };
}

export type UserDataChange = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
};
export function setUserData(data: UserDataChange) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: ACTIONS.SET_USER_DATA.REQUEST });

        HttpRequest.put(ACTIONS.SET_USER_DATA.API)
            .withBody(data)
            .onSuccess((response: any) => {
                dispatch(success(ACTIONS.SET_USER_DATA.SUCCESS, response));
                dispatch(loadUserInfo());
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.SET_USER_DATA.FAILURE, response, 'SetUserData'));
            })
            .request();
    };
}
