/* Constants */
import {BASEURL, failure, success, checkTimeout} from './actions.js';

export const GET_BIOS = {REQUEST: 'GET_BIOS', SUCCESS: 'GET_BIOS_SUCCESS', FAIL: 'GET_BIOS_FAIL'};
export const UPDATE_BIO = {REQUEST: 'UPDATE_BIO', SUCCESS: 'UPDATE_BIO_SUCCESS', FAIL: 'UPDATE_BIO_FAIL'};
export const ADD_BIO = {REQUEST: 'ADD_BIO', SUCCESS: 'ADD_BIO_SUCCESS', FAIL: 'ADD_BIO_FAIL'};
export const REMOVE_BIO = {REQUEST: 'REMOVE_BIO', SUCCESS: 'REMOVE_BIO_SUCCESS', FAIL: 'REMOVE_BIO_FAIL'};

/* Retrieves List of available lesson swingesssential pro bios */
export function getBios(token){
    return (dispatch) => {
        dispatch({type:GET_BIOS.REQUEST});

        return fetch(BASEURL+'bios', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_BIOS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('bios',JSON.stringify(response.data)));                    
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_BIOS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Updates the details for the specified bio */
export function updateBio(token, pack){
    return (dispatch) => {
        dispatch({type: UPDATE_BIO.REQUEST});
        return fetch(BASEURL+'bio', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(UPDATE_BIO.SUCCESS));
                    dispatch(getBios(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(UPDATE_BIO.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Removes a bio from the database */
export function removeBio(token, pack){
    return (dispatch) => {
        dispatch({type: REMOVE_BIO.REQUEST});
        return fetch(BASEURL+'removebio', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(REMOVE_BIO.SUCCESS));
                    dispatch(getBios(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REMOVE_BIO.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Adds a new bio to the database */
export function addBio(token, pack){
    return (dispatch) => {
        dispatch({type: ADD_BIO.REQUEST});
        return fetch(BASEURL+'bio', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(ADD_BIO.SUCCESS));
                    dispatch(getBios(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ADD_BIO.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}