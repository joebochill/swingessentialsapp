/* Dispatch a failure action for the supplied action type */
export function failure(type, response) {
    if (response && response.headers && response.headers.get) {
        // logLocalError('102: Error ' + response.headers.get('Error') + ': ' + response.headers.get('Message'));
        console.log('ERROR: request failure, fetch');
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
        // logLocalError('103: Error ' + response.getResponseHeader('Error') + ': ' + response.getResponseHeader('Message'));
        console.log('ERROR: request failure, XMLHTTP');
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
