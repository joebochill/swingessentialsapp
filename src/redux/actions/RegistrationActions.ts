import { HttpRequest } from '../../api/http';
import { success, failure, xhrfailure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';
import { ThunkDispatch } from 'redux-thunk';
import { PlatformOSType } from 'react-native';

export function checkUsernameAvailability(username: string) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.CHECK_USERNAME.REQUEST });
        HttpRequest.get(`${ACTIONS.CHECK_USERNAME.API}?username=${encodeURIComponent(username)}`)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.CHECK_USERNAME.SUCCESS, body)); // {...json, lastChecked: username}
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CHECK_USERNAME.FAILURE, response, 'CheckUsername'));
            })
            .request();
    };
}

export function checkEmailAvailability(email: string) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.CHECK_EMAIL.REQUEST });
        HttpRequest.get(`${ACTIONS.CHECK_EMAIL.API}?email=${encodeURIComponent(email)}`)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.CHECK_EMAIL.SUCCESS, body)); // {...json, lastChecked: email}
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CHECK_EMAIL.FAILURE, response, 'CheckEmail'));
            })
            .request();
    };
}

type NewAccountDetails = {
    username: string;
    email: string;
    password: string;
    heard: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    platform: PlatformOSType;
};
export function createAccount(data: NewAccountDetails) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.CREATE_ACCOUNT.REQUEST });
        HttpRequest.put(ACTIONS.CREATE_ACCOUNT.API)
            .withBody(data)
            .onSuccess((response: any) => {
                const token = response.headers.get('Token');
                dispatch(success(ACTIONS.CREATE_ACCOUNT.SUCCESS, { token }));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CREATE_ACCOUNT.FAILURE, response, 'CreateAccount'));
            })
            .request();
    };
}

export function verifyEmail(code: string) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.VERIFY_EMAIL.REQUEST });
        HttpRequest.put(ACTIONS.VERIFY_EMAIL.API)
            .withBody({ type: 'email', code: code })
            .onSuccess((response: any) => {
                dispatch(success(ACTIONS.VERIFY_EMAIL.SUCCESS, response));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.VERIFY_EMAIL.FAILURE, response, 'VerifyEmail'));
            })
            .request();
    };
}

export function requestPasswordReset(data: { email: string }) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.RESET_PASSWORD_EMAIL.REQUEST });
        HttpRequest.put(ACTIONS.RESET_PASSWORD_EMAIL.API)
            .withBody(data)
            .onSuccess((response: any) => {
                dispatch(success(ACTIONS.RESET_PASSWORD_EMAIL.SUCCESS, response));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.RESET_PASSWORD_EMAIL.FAILURE, response, 'ResetRequest'));
            })
            .request();
    };
}
