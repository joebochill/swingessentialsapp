// import { AsyncStorage } from 'react-native';

/* Constants */
import {BASEURL, AUTH, failure, success, checkTimeout} from './actions.js';
export const GET_TIPS = {REQUEST: 'GET_TIPS', SUCCESS: 'GET_TIPS_SUCCESS', FAIL: 'GET_TIPS_FAIL'};


/* Retrieves List of Tips-of-the-month */
/* Specifying an admin token will retrieve future tips as well as current */
export function getTips(token=null){
    return (dispatch) => {
        dispatch({type: GET_TIPS.REQUEST});
        return fetch(BASEURL+'tips', {
            method: 'GET',
            headers: (!token ? {} : {
                [AUTH]: 'Bearer ' + token
            }) 
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_TIPS.SUCCESS, json)))
                    //.then((response) => AsyncStorage.setItem('@SwingEssentials:tips', JSON.stringify(response.data)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_TIPS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}