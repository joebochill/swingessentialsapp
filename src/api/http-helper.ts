
/* Dispatch a failure action for the supplied action type */
export function failure(type, response) {
    // if(response && response.headers && response.headers.get){
    //     logLocalError('102: Error ' + response.headers.get('Error') + ': ' + response.headers.get('Message'));
    // }

    return {
        type: type,
        response: response,
        error: (response && response.headers && response.headers.get) ? response.headers.get('Error') : 'N/A'
    }
}

/* Dispatch a failure action for the supplied action type, XMLHTTPRequest variant */
// export function xhrfailure(type, response){
//     if(response && response.getResponseHeader){
//         logLocalError('103: Error ' + response.getResponseHeader('Error') + ': ' + response.getResponseHeader('Message'));
//     }

//     return{
//         type: type,
//         response: response,
//         error: (response && response.getResponseHeader) ? response.getResponseHeader('Error') : 'N/A'
//     }
// }

/* Dispatch a success action for the supplied action type */
export function success(type, data = null) {
    return {
        type: type,
        payload: data
    }
}