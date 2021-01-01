import { ThunkDispatch } from 'redux-thunk';

import * as ACTIONS from './types';

import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { loadSettings } from './SettingsActions';

export function loadUserInfo() {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: ACTIONS.GET_BLOGS.REQUEST });

        void HttpRequest.get(ACTIONS.GET_USER_DATA.API)
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

        void HttpRequest.put(ACTIONS.SET_USER_DATA.API)
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

type SetAvatar = {
    useAvatar: 0 | 1;
    avatar: string;
};
export function setUserAvatar(data: SetAvatar) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: ACTIONS.CHANGE_AVATAR.REQUEST });

        void HttpRequest.post(ACTIONS.CHANGE_AVATAR.API)
            .withBody(data)
            .onSuccess((response: any) => {
                dispatch(success(ACTIONS.CHANGE_AVATAR.SUCCESS, response));
                dispatch(loadSettings());
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CHANGE_AVATAR.FAILURE, response));
            })
            .request();
    };
}
