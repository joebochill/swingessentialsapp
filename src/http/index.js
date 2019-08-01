// import { AsyncStorage } from '@react-native-community/async-storage';
// import { TOKEN_TIMEOUT } from '../redux/actions';
import { LOGIN } from '../redux/actions';


/* Base URL for fetch commands */
export const BASEURL = 'https://www.swingessentials.com/apis/swingessentials.php/';
export const AUTH = 'Message';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const btoa = (input = '') => {
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