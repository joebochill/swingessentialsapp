import { HttpRequest } from '../../api/http';
import { success, failure, xhrfailure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';
import { ThunkDispatch } from 'redux-thunk';
import { PlatformOSType } from 'react-native';

export function checkUsernameAvailability(username: string) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.CHECK_USERNAME.REQUEST });
        HttpRequest.get(`${ACTIONS.CHECK_USERNAME.API}?username=${encodeURIComponent(username)}`)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.CHECK_USERNAME.SUCCESS, body)); // {...json, lastChecked: username}
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CHECK_USERNAME.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    }
}

export function checkEmailAvailability(email: string) {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.CHECK_EMAIL.REQUEST });
        HttpRequest.get(`${ACTIONS.CHECK_EMAIL.API}?email=${encodeURIComponent(email)}`)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.CHECK_EMAIL.SUCCESS, body)); // {...json, lastChecked: email}
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.CHECK_EMAIL.FAILURE, response));
                console.log(response.headers.get('Error'));
            })
            .request();
    }
}

type NewAccountDetails = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    heard: string;
    phone: string;
    password: string;
    platform: PlatformOSType;
}
export function createAccount(data: NewAccountDetails) {
    return (dispatch: Dispatch) => {
        console.log('action hit');
        dispatch({ type: ACTIONS.CREATE_ACCOUNT.REQUEST });
        setTimeout(() => {
            console.log('dispatching success');
            dispatch({ type: ACTIONS.CREATE_ACCOUNT.SUCCESS, payload: {token: 'testtoken'} });
        }, 5000);
        // HttpRequest.put(ACTIONS.CREATE_ACCOUNT.API)
        //     .withBody(data)
        //     .onSuccess((response: any) => {
        //         const token = response.headers.get('Token');
        //         dispatch(success(ACTIONS.CREATE_ACCOUNT.SUCCESS, { token }))
        //         // dispatch(getUserData(token));
        //         // dispatch(getLessons(token));
        //         // dispatch(getCredits(token));
        //         // dispatch(getSettings(token));
        //     })
        //     .onFailure((response: Response) => {
        //         dispatch(failure(ACTIONS.CREATE_ACCOUNT.FAILURE, response));
        //         console.log(response.headers.get('Error'));
        //     })
        //     .request();
    }
}

// /* Creates a new (tentative) user account */
// export function createAccount(data){
//     return (dispatch) => {
//         if(Object.keys(data).length < 1){return;}
//         dispatch({type: CREATE_ACCOUNT.REQUEST});

//         return fetch(BASEURL+'user', { 
//             method: 'PUT',
//             body: JSON.stringify(data)
//         })
//         .then((response) => {
//             switch(response.status) {
//                 case 200:
//                     dispatch(success(CREATE_ACCOUNT.SUCCESS,{token: response.headers.get('Token')}));
//                     const token = response.headers.get('Token');
//                     dispatch(getUserData(token));
//                     dispatch(getLessons(token));
//                     dispatch(getCredits(token));
//                     dispatch(getSettings(token));
//                     break;
//                 default:
//                     //checkTimeout(response, dispatch);
//                     dispatch(failure(CREATE_ACCOUNT.FAIL, response));
//                     break;
//             }
//         })
//         .catch((error) => {
//             logLocalError('120: Promise Error: creating account');
//         });
//     }
// }

// /* Requests a password reset for the account linked to the supplied email address */
// export function requestReset(data){
//     return (dispatch) => {
//         fetch(BASEURL+'reset', { 
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         .then((response) => {
//             switch(response.status) {
//                 case 200:
//                     dispatch(success(REQUEST_RESET.SUCCESS));
//                     break;
//                 default:
//                     checkTimeout(response, dispatch);
//                     dispatch(failure(REQUEST_RESET.FAIL, response));
//                     break;
//             }
//         })
//         .catch((error) => {
//             logLocalError('121: Promise Error: resetting password');
//         });
//     }
// }

// /* Lets the database know that a user has verified his email address
// and is now a full, verified user */
// export function verifyEmail(code){   
//     return (dispatch) => {

//         dispatch({type: VERIFY_EMAIL.REQUEST});

//         return fetch(BASEURL+'verify', { 
//             method: 'PUT',
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify({type:'email',code: code})
//         })
//         .then((response) => {
//             switch(response.status) {
//                 case 200:
//                     dispatch(success(VERIFY_EMAIL.SUCCESS));
//                     break;
//                 default:
//                     checkTimeout(response, dispatch);
//                     dispatch(failure(VERIFY_EMAIL.FAIL, response));
//                     break;
//             }
//         })
//         .catch((error) => {
//             logLocalError('122: Promise Error: verifying email');
//         });
//     }
// }