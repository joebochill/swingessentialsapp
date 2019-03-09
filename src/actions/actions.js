import { logLocalError, clearErrorLog } from "../utils/utils";
import {AsyncStorage} from 'react-native';
import { ASYNC_PREFIX } from "../constants";

/* Constants */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';

/* Base URL for fetch commands */
export const BASEURL = 'https://www.swingessentials.com/apis/swingessentials.php/';
export const AUTH = 'Message';

// Send report with log data to swingessentials
export function sendLogReport(token, data){
    return (dispatch) => {
        fetch(BASEURL+'logs', { 
            method: 'POST',
            headers: {
                [AUTH]: 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    clearErrorLog();
                    AsyncStorage.setItem(ASYNC_PREFIX+'logs_sent', ('' + Math.floor(Date.now()/1000)));
                    break;
                default:
                    logLocalError('999: Failed to submit error log automatically');
            }
        })
        .catch((error) => {
            logLocalError('116: Promise Error: checking token');
        });
    }
}

/* Check if the request failed because of an expired token */
export function checkTimeout(response, dispatch){
    // If we get a failed API call, check if our authentication needs to be re-upped
    const error = (response && response.headers && response.headers.get)?parseInt(response.headers.get('Error'),10):999;
    if(error && (error === 400100) && dispatch){
        //localStorage.removeItem('token');
        //localStorage.removeItem('lessons');
        //localStorage.removeItem('credits');
        //localStorage.removeItem('blogs');
        //localStorage.removeItem('tips');
        dispatch({type:TOKEN_TIMEOUT});
    }
}


/* Dispatch a failure action for the supplied action type */
export function failure(type, response){
    if(response && response.headers && response.headers.get){
        logLocalError('102: Error ' + response.headers.get('Error') + ': ' + response.headers.get('Message'));
    }
    
    return{
        type: type,
        response: response,
        error: (response && response.headers && response.headers.get) ? response.headers.get('Error') : 'N/A'
    }
}

/* Dispatch a failure action for the supplied action type, XMLHTTPRequest variant */
export function xhrfailure(type, response){
    if(response && response.getResponseHeader){
        logLocalError('103: Error ' + response.getResponseHeader('Error') + ': ' + response.getResponseHeader('Message'));
    }
    
    return{
        type: type,
        response: response,
        error: (response && response.getResponseHeader) ? response.getResponseHeader('Error') : 'N/A'
    }
}

/* Dispatch a success action for the supplied action type */
export function success(type, data=null){
    return{
        type: type,
        data: data
    }
}

