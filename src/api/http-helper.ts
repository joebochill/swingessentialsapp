// import { AsyncStorage } from '@react-native-community/async-storage';
// import { TOKEN_TIMEOUT } from '../redux/actions';
import { LOGIN } from '../redux/actions/types'


/* Base URL for fetch commands */
export const BASEURL = 'https://www.swingessentials.com/apis/swingessentials.php/';
export const AUTH = 'Message';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export const btoa = (input = '') => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || (map = '=', i % 1);
        output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

        charCode = str.charCodeAt(i += 3 / 4);

        if (charCode > 0xFF) {
            throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }

        block = block << 8 | charCode;
    }

    return output;
};

let TOKEN = null;
function _setToken(newToken) {
    TOKEN = newToken;
}

export const saveAuthToken = store => next => action => {
    if (action.type === LOGIN.SUCCESS) {
        _setToken(action.payload.token);
    }
    else if (action.type === LOGIN.FAILURE) {
        _setToken(null);
    }
    // continue processing this action
    return next(action);
}



/* Retrieves a list of lessons */
export function http(options) {
    const {
        method = 'GET',
        action,
        credentials
    } = options;

    return fetch(BASEURL + action.API,
        {
            method: method,
            headers: {
                [AUTH]: TOKEN ? ('Bearer ' + TOKEN) : ('Basic ' + btoa(credentials.username) + '.' + btoa(credentials.password))
            }
        })
        .catch((error) => {
            //logLocalError('106: Promise Error: getting lessons');
            console.log('Promise error ', error);
        });
}

export function handleResponse(action, dispatch, response, success_callback, failure_callback = ()=>{console.log(action.SUCCESS + 'failed')}){
    switch (response.status) {
        case 200:
            if(success_callback) success_callback();
            else dispatch(success(action.SUCCESS))
            break;
        default:
            if(failure_callback) failure_callback();
            dispatch(failure(action.FAILURE, response));
            break;
    }
}

/* Dispatch a failure action for the supplied action type */
export function failure(type, response){
    // if(response && response.headers && response.headers.get){
    //     logLocalError('102: Error ' + response.headers.get('Error') + ': ' + response.headers.get('Message'));
    // }
    
    return{
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
export function success(type, data=null){
    return{
        type: type,
        payload: data
    }
}