import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';
import { PlatformOSType } from 'react-native';

export function checkUsernameAvailability(username: string) {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.CHECK_USERNAME.REQUEST });
        void HttpRequest.get(`${ACTIONS.CHECK_USERNAME.API}?username=${encodeURIComponent(username)}`)
            .onSuccess((body: any): void => {
                dispatch(success(ACTIONS.CHECK_USERNAME.SUCCESS, body)); // {...json, lastChecked: username}
            })
            .onFailure((response: Response): void => {
                dispatch(failure(ACTIONS.CHECK_USERNAME.FAILURE, response, 'CheckUsername'));
            })
            .request();
    };
}

export function checkEmailAvailability(email: string) {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.CHECK_EMAIL.REQUEST });
        void HttpRequest.get(`${ACTIONS.CHECK_EMAIL.API}?email=${encodeURIComponent(email)}`)
            .onSuccess((body: any): void => {
                dispatch(success(ACTIONS.CHECK_EMAIL.SUCCESS, body)); // {...json, lastChecked: email}
            })
            .onFailure((response: Response): void => {
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
    // phone?: string;
    // location?: string;
    platform: PlatformOSType;
};
export function createAccount(data: NewAccountDetails) {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.CREATE_ACCOUNT.REQUEST });
        void HttpRequest.put(ACTIONS.CREATE_ACCOUNT.API)
            .withBody(data)
            .onSuccess((response: any): void => {
                const token = response.headers.get('Token');
                dispatch(success(ACTIONS.CREATE_ACCOUNT.SUCCESS, { token, personal: data }));
            })
            .onFailure((response: Response): void => {
                dispatch(failure(ACTIONS.CREATE_ACCOUNT.FAILURE, response, 'CreateAccount'));
            })
            .request();
    };
}

export function verifyEmail(code: string) {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.VERIFY_EMAIL.REQUEST });
        void HttpRequest.put(ACTIONS.VERIFY_EMAIL.API)
            .withBody({ type: 'email', code: code })
            .onSuccess((response: any): void => {
                dispatch(success(ACTIONS.VERIFY_EMAIL.SUCCESS, response));
            })
            .onFailure((response: Response): void => {
                dispatch(failure(ACTIONS.VERIFY_EMAIL.FAILURE, response, 'VerifyEmail'));
            })
            .request();
    };
}

export function requestPasswordReset(data: { email: string }) {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ACTIONS.RESET_PASSWORD_EMAIL.REQUEST });
        void HttpRequest.put(ACTIONS.RESET_PASSWORD_EMAIL.API)
            .withBody(data)
            .onSuccess((response: any): void => {
                dispatch(success(ACTIONS.RESET_PASSWORD_EMAIL.SUCCESS, response));
            })
            .onFailure((response: Response): void => {
                dispatch(failure(ACTIONS.RESET_PASSWORD_EMAIL.FAILURE, response, 'ResetRequest'));
            })
            .request();
    };
}
