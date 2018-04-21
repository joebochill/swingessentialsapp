/* Constants */
import {BASEURL, failure, xhrfailure, success, checkTimeout} from './actions.js';
// import {getUserData, getSettings} from './UserDataActions.js';

export const GET_LESSONS = {REQUEST: 'GET_LESSONS', SUCCESS: 'GET_LESSONS_SUCCESS', FAIL: 'GET_LESSONS_FAIL'};
export const REDEEM_CREDIT = {REQUEST: 'REDEEM_CREDIT', SUCCESS: 'REDEEM_CREDIT_SUCCESS', FAIL: 'REDEEM_CREDIT_FAIL'};
export const ACTIVATE_UNLIMITED = {REQUEST: 'ACTIVATE_UNLIMITED', SUCCESS: 'ACTIVATE_UNLIMITED_SUCCESS', FAIL: 'ACTIVATE_UNLIMITED_FAIL'};
export const GET_CREDITS = {REQUEST: 'GET_CREDITS', SUCCESS: 'GET_CREDITS_SUCCESS', FAIL: 'GET_CREDITS_FAIL'};
export const PURCHASE_LESSON = {REQUEST: 'PURCHASE_LESSON', SUCCESS: 'PURCHASE_LESSON_SUCCESS', FAIL: 'PURCHASE_LESSON_FAIL'};
export const EXECUTE_PAYMENT = {REQUEST: 'EXECUTE_PAYMENT', SUCCESS: 'EXECUTE_PAYMENT_SUCCESS', FAIL: 'EXECUTE_PAYMENT_FAIL'};
export const CHECK_COUPON = {REQUEST: 'CHECK_COUPON', SUCCESS: 'CHECK_COUPON_SUCCESS', FAIL: 'CHECK_COUPON_FAILURE'};
export const MARK_VIEWED = {REQUEST: 'MARK_VIEWED', SUCCESS: 'MARK_VIEWED_SUCCESS', FAIL: 'MARK_VIEWED_FAIL'};

/* Checks the specified coupon code for validity */
export function checkCoupon(code){
    return (dispatch) => {
        dispatch({type: CHECK_COUPON.REQUEST});

        return fetch(BASEURL+'checkCoupon?code='+code)
        .then((response) => {
            switch(response.status){
                case 200:
                    response.json()
                    .then((json) => dispatch(success(CHECK_COUPON.SUCCESS, json)));
                    break;
                default:
                    dispatch(failure(CHECK_COUPON.FAIL, response));
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Retrieves a list of lessons */
export function getLessons(token){
    return (dispatch) => {
        dispatch({type: GET_LESSONS.REQUEST});
        return fetch(BASEURL+'lessons', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_LESSONS.SUCCESS, json)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_LESSONS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Retrieves available credits */
export function getCredits(token){
    return (dispatch) => {
        dispatch({type: GET_CREDITS.REQUEST});

        return fetch(BASEURL+'credits', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) =>{dispatch(success(GET_CREDITS.SUCCESS, json))});
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_CREDITS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}
export function futch(url, opts={}, onProgress) {
    return new Promise( (res, rej)=>{
        var xhr = new XMLHttpRequest();

        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4) {
        //         res(xhr/*'test'/*xhr.response*/); //Outputs a DOMString by default
        //     }
        // }

        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers||{})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(xhr);
        xhr.onerror = rej;
        if (xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}

/* Lets a user redeem a credit and submit a new lesson request */
export function redeemCredit(data, token, updateProgress){
    return (dispatch) => {
        dispatch({type: REDEEM_CREDIT.REQUEST});
        
        return futch(BASEURL+'redeem/', { 
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: data
        }, updateProgress)
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(REDEEM_CREDIT.SUCCESS));
                    dispatch(getLessons(token));
                    break;
                default:   
                    checkTimeout(response, dispatch);
                    dispatch(xhrfailure(REDEEM_CREDIT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Activates an unlimited lesson deal */
export function activateUnlimited(token){
    return (dispatch) => {
        dispatch({type: ACTIVATE_UNLIMITED.REQUEST});
        
        return fetch(BASEURL+'unlimited/', { 
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(ACTIVATE_UNLIMITED.SUCCESS));
                    dispatch(getCredits(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ACTIVATE_UNLIMITED.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Mark the specified lesson as viewed when it's seen by the target user */
export function markLessonViewed(data, token){
    return (dispatch) => {
        dispatch({type: MARK_VIEWED.REQUEST});

        return fetch(BASEURL+'viewed/', { 
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(MARK_VIEWED.SUCCESS));
                    dispatch(getLessons(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(MARK_VIEWED.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Hands the payment processing over to the server */
export function executePayment(data, token){
    return (dispatch) => {
        dispatch({type: EXECUTE_PAYMENT.REQUEST});

        return fetch(BASEURL+'executeiospayment/', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(EXECUTE_PAYMENT.SUCCESS));
                    dispatch(getCredits(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(EXECUTE_PAYMENT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}