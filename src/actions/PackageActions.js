/* Constants */
import {BASEURL, failure, success, checkTimeout} from './actions.js';

export const GET_PACKAGES = {REQUEST: 'GET_PACKAGES', SUCCESS: 'GET_PACKAGES_SUCCESS', FAIL: 'GET_PACKAGES_FAIL'};
export const UPDATE_PACKAGE = {REQUEST: 'UPDATE_PACKAGE', SUCCESS: 'UPDATE_PACKAGE_SUCCESS', FAIL: 'UPDATE_PACKAGE_FAIL'};
export const ADD_PACKAGE = {REQUEST: 'ADD_PACKAGE', SUCCESS: 'ADD_PACKAGE_SUCCESS', FAIL: 'ADD_PACKAGE_FAIL'};
export const REMOVE_PACKAGE = {REQUEST: 'REMOVE_PACKAGE', SUCCESS: 'REMOVE_PACKAGE_SUCCESS', FAIL: 'REMOVE_PACKAGE_FAIL'};

/* Retrieves List of available lesson packages and prices */
export function getPackages(token){
    return (dispatch) => {
        dispatch({type:GET_PACKAGES.REQUEST});

        return fetch(BASEURL+'packages', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_PACKAGES.SUCCESS, json)))
                    .then((response) => localStorage.setItem('packages',JSON.stringify(response.data)));                    
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_PACKAGES.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Updates the details for the specified package */
export function updatePackage(token, pack){
    return (dispatch) => {
        dispatch({type: UPDATE_PACKAGE.REQUEST});
        return fetch(BASEURL+'package', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(UPDATE_PACKAGE.SUCCESS));
                    dispatch(getPackages(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(UPDATE_PACKAGE.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Removes a package deal from the database */
export function removePackage(token, pack){
    return (dispatch) => {
        dispatch({type: REMOVE_PACKAGE.REQUEST});
        return fetch(BASEURL+'removepackage', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(REMOVE_PACKAGE.SUCCESS));
                    dispatch(getPackages(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REMOVE_PACKAGE.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Adds a new package deal to the database */
export function addPackage(token, pack){
    return (dispatch) => {
        dispatch({type: ADD_PACKAGE.REQUEST});
        return fetch(BASEURL+'package', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(pack)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(ADD_PACKAGE.SUCCESS));
                    dispatch(getPackages(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ADD_PACKAGE.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}