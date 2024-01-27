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
import { loadPros } from './ProsActions';

export function loadInitialData(): (dispatch: ThunkDispatch<any, void, any>) => void {
    return async (dispatch: ThunkDispatch<any, void, any>): Promise<void> => {
        const token = await AsyncStorage.getItem(`${ASYNC_PREFIX}token`);
        if (token) dispatch(setToken(token));

        dispatch({ type: ACTIONS.INITIAL_LOAD });
        dispatch(loadPlaceholder());
        dispatch(loadUserInfo());
        dispatch(loadTips());
        dispatch(loadBlogs());
        dispatch(loadPackages());
        dispatch(loadFAQ());
        dispatch(loadPros());
        dispatch(loadTutorials());
    };
}

// Send report with log data to swingessentials
export function sendLogReport(log: string, type: LOG_TYPE) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        if (Logger.isSending()) return;
        dispatch({ type: ACTIONS.SEND_LOGS.REQUEST });
        Logger.setSending(true);
        void HttpRequest.post(ACTIONS.SEND_LOGS.API)
            .withBody({ platform: Platform.OS, data: log })
            .onSuccess((body: any) => {
                void Logger.clear(type);
                void AsyncStorage.setItem(`${ASYNC_PREFIX}logs_sent`, `${Math.floor(Date.now() / 1000)}`);
                dispatch(success(ACTIONS.SEND_LOGS.SUCCESS, body));
                Logger.setSending(false);
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.SEND_LOGS.FAILURE, response, 'SendLogs'));
                Logger.setSending(false);
            })
            .request();
    };
}
