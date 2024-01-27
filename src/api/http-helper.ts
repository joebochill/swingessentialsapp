import { Logger } from '../utilities/logging';
// import { TOKEN_TIMEOUT } from '../redux/actions/types';
// import { store } from '../redux/store';
// import { loadUserContent } from '../redux/actions/LoginActions';
// import { ThunkDispatch } from 'redux-thunk';

/* Dispatch a failure action for the supplied action type */
type FailureResponse = { type: string; response: Response; error: string | null };
export function failure(type: string, response: Response, api = '--', log = true): FailureResponse {
    if (response && response.headers && response.headers.get) {
        if (log) {
            void Logger.logError({
                code: 'HTH100',
                description: `API Failure response (${api}).`,
                rawErrorCode: response.headers.get('Error'),
                rawErrorMessage: response.headers.get('Message'),
            });
        }
    }

    return {
        type: type,
        response: response,
        error: response && response.headers && response.headers.get ? response.headers.get('Error') : 'N/A',
    };
}

/* Dispatch a failure action for the supplied action type, XMLHTTPRequest variant */
type XHRFailureResponse = { type: string; response: XMLHttpRequest; error: number };
export function xhrfailure(type: string, response: XMLHttpRequest): XHRFailureResponse {
    if (response && response.getResponseHeader) {
        void Logger.logError({
            code: 'HTH200',
            description: `XHR Failure response`,
            rawErrorCode: response.getResponseHeader('Error'),
            rawErrorMessage: response.getResponseHeader('Message'),
        });
    }

    return {
        type: type,
        response: response,
        error: response && response.getResponseHeader ? parseInt(response.getResponseHeader('Error') || '', 10) : -1,
    };
}

/* Dispatch a success action for the supplied action type */
type SuccessResponse = { type: string; payload: any };
export function success(type: string, data: any = null): SuccessResponse {
    return {
        type: type,
        payload: data,
    };
}

// export function checkTimeout(response: Response, dispatch: ThunkDispatch<any, void, any>): void {
//     // If we get a failed API call, check if our authentication needs to be re-upped
//     const error =
//         response && response.headers && response.headers.get ? parseInt(response.headers.get('Error') || '', 10) : 999;
//     if (error && error === 400100 && dispatch) {
//         store.dispatch({ type: TOKEN_TIMEOUT });
//         store.dispatch(loadUserContent());
//     }
// }
