import { Logger } from "../utilities/logging";
import { TOKEN_TIMEOUT } from "../redux/actions/types";
import { store } from '../../App';

/* Dispatch a failure action for the supplied action type */
export function failure(type, response, api = '--') {
    if (response && response.headers && response.headers.get) {
        Logger.logError({
            code: 'HTH100',
            description: `API Failure response (${api}).`,
            rawErrorCode: response.headers.get('Error'),
            rawErrorMessage: response.headers.get('Message'),
        })
    }

    return {
        type: type,
        response: response,
        error: response && response.headers && response.headers.get ? response.headers.get('Error') : 'N/A',
    };
}

/* Dispatch a failure action for the supplied action type, XMLHTTPRequest variant */
export function xhrfailure(type, response) {
    if (response && response.getResponseHeader) {
        Logger.logError({
            code: 'HTH200',
            description: `XHR Failure response`,
            rawErrorCode: response.getResponseHeader('Error'),
            rawErrorMessage: response.getResponseHeader('Message'),
        })
    }

    return {
        type: type,
        response: response,
        error: response && response.getResponseHeader ? parseInt(response.getResponseHeader('Error'), 10) : -1,
    };
}

/* Dispatch a success action for the supplied action type */
export function success(type, data: any = null) {
    return {
        type: type,
        payload: data,
    };
}

export function checkTimeout(response, dispatch) {
    // If we get a failed API call, check if our authentication needs to be re-upped
    const error = (response && response.headers && response.headers.get) ? parseInt(response.headers.get('Error'), 10) : 999;
    if (error && (error === 400100) && dispatch) {
        store.dispatch({ type: TOKEN_TIMEOUT });
    }
}