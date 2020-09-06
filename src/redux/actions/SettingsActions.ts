import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { UserSettingsType } from '../../__types__';

import * as ACTIONS from './types';

/* Retrieves user app settings from the database */
export function loadSettings() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_SETTINGS.REQUEST });

        HttpRequest.get(ACTIONS.GET_SETTINGS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_SETTINGS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_SETTINGS.FAILURE, response, 'LoadSettings'));
            })
            .request();
    };
}

type SettingsUpdateType = Exclude<Exclude<UserSettingsType, 'loading'>, 'notifications'> & {
    subscribe: boolean
};

/* Updates the user app settings in the database */
export function putSettings(data: Partial<SettingsUpdateType>) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.PUT_SETTINGS.REQUEST });
        HttpRequest.put(ACTIONS.PUT_SETTINGS.API)
            .withBody(data)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.PUT_SETTINGS.SUCCESS));
                dispatch(loadSettings());
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.PUT_SETTINGS.FAILURE, response, 'SaveSettings'));
            })
            .request();
    };
}
