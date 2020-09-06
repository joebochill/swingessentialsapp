import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';
import { loadTips } from './TipActions';
import { loadBlogs } from './BlogActions';
import { loadPackages } from './PackageActions';
import { loadFAQ, loadPlaceholder } from './FAQActions';
import AsyncStorage from '@react-native-community/async-storage';
import { ASYNC_PREFIX } from '../../constants';
import { setToken } from './LoginActions';
import { loadTutorials } from './TutorialsActions';
import { HttpRequest } from '../../api/http';
import { Logger, LOG_TYPE } from '../../utilities/logging';
import { success, failure } from '../../api/http-helper';
import { Platform } from 'react-native';
import { loadUserInfo } from './user-data-actions';

export function loadInitialData(): Function {
    return async (dispatch: ThunkDispatch<any, void, any>) => {
        const token = await AsyncStorage.getItem(ASYNC_PREFIX + 'token');
        if (token) dispatch(setToken(token));

        dispatch({ type: ACTIONS.INITIAL_LOAD });
        dispatch(loadPlaceholder());
        dispatch(loadUserInfo());
        dispatch(loadTips());
        dispatch(loadBlogs());
        dispatch(loadPackages());
        dispatch(loadFAQ());
        dispatch(loadTutorials());
    };
}

// Send report with log data to swingessentials
export function sendLogReport(log: string, type: LOG_TYPE) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.SEND_LOGS.REQUEST });
        HttpRequest.post(ACTIONS.SEND_LOGS.API)
            .withBody({ platform: Platform.OS, data: log })
            .onSuccess((body: any) => {
                Logger.clear(type);
                AsyncStorage.setItem(ASYNC_PREFIX + 'logs_sent', '' + Math.floor(Date.now() / 1000));
                dispatch(success(ACTIONS.SEND_LOGS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.SEND_LOGS.FAILURE, response, 'SendLogs'));
            })
            .request();
    };
}
