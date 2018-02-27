/* Constants */
import {BASEURL, failure, success, checkTimeout} from './actions.js';

export const GET_DISCOUNTS = {REQUEST: 'GET_DISCOUNTS', SUCCESS: 'GET_DISCOUNTS_SUCCESS', FAIL: 'GET_DISCOUNTS_FAIL'};
export const UPDATE_DISCOUNT = {REQUEST: 'UPDATE_DISCOUNT', SUCCESS: 'UPDATE_DISCOUNT_SUCCESS', FAIL: 'UPDATE_DISCOUNT_FAIL'};
export const ADD_DISCOUNT = {REQUEST: 'ADD_DISCOUNT', SUCCESS: 'ADD_DISCOUNT_SUCCESS', FAIL: 'ADD_DISCOUNT_FAIL'};
export const REMOVE_DISCOUNT = {REQUEST: 'REMOVE_DISCOUNT', SUCCESS: 'REMOVE_DISCOUNT_SUCCESS', FAIL: 'REMOVE_DISCOUNT_FAIL'};

/* Retrieves List of available discount coupons - admin only */
export function getDiscounts(token){
    return (dispatch) => {
        dispatch({type:GET_DISCOUNTS.REQUEST});

        return fetch(BASEURL+'discounts', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_DISCOUNTS.SUCCESS, json)))
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_DISCOUNTS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Updates the details for the specified discount */
export function updateDiscount(token, coupon){
    return (dispatch) => {
        dispatch({type: UPDATE_DISCOUNT.REQUEST});
        return fetch(BASEURL+'discount', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(coupon)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(UPDATE_DISCOUNT.SUCCESS));
                    dispatch(getDiscounts(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(UPDATE_DISCOUNT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Removes a discount from the database */
export function removeDiscount(token, coupon){
    return (dispatch) => {
        dispatch({type: REMOVE_DISCOUNT.REQUEST});
        return fetch(BASEURL+'removediscount', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(coupon)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(REMOVE_DISCOUNT.SUCCESS));
                    dispatch(getDiscounts(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REMOVE_DISCOUNT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Adds a new discount to the database */
export function addDiscount(token, coupon){
    return (dispatch) => {
        dispatch({type: ADD_DISCOUNT.REQUEST});
        return fetch(BASEURL+'discount', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(coupon)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(ADD_DISCOUNT.SUCCESS));
                    dispatch(getDiscounts(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ADD_DISCOUNT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}