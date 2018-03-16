/* Constants */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';
export const GET_PACKAGES = {REQUEST: 'GET_PACKAGES', SUCCESS: 'GET_PACKAGES_SUCCESS', FAIL: 'GET_PACKAGES_FAIL'};

/* Base URL for fetch commands */
// export const BASEURL = 'http://www.josephpboyle.com/api/swingessentialsapi.php/';
// export const BASEURL = 'https://www.swingessentials.com/apis/swingessentials.php/';
export const BASEURL = 'http://www.josephpboyle.com/api/swingessentials2.php/';


//const API_KEY = 'AIzaSyAzvggwVpvJ1pngsjQKJ84FcY8v07C8dNA';
//const googleURL = 'https://www.googleapis.com/upload/storage/v1/b/www.joebochill.com/';


/* Check if the request failed because of an expired token */
export function checkTimeout(response, dispatch){
    // If we get a failed API call, check if our authentication needs to be re-upped
    const error = (response && response.headers && response.headers.get)?parseInt(response.headers.get('Error'),10):999;
    if(error && (error === 400100) && dispatch){
        localStorage.removeItem('token');
        localStorage.removeItem('lessons');
        localStorage.removeItem('credits');
        localStorage.removeItem('blogs');
        localStorage.removeItem('tips');
        dispatch({type:TOKEN_TIMEOUT});
    }
}

/* Dispatch a failure action for the supplied action type */
export function failure(type, response){
    if(response && response.headers && response.headers.get){
        console.log('Error ' + response.headers.get('Error') + ': ' + response.headers.get('Message'));
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
        console.log('Error ' + response.getResponseHeader('Error') + ': ' + response.getResponseHeader('Message'));
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

