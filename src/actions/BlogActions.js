// import { AsyncStorage } from 'react-native';

/* Constants */
import {BASEURL, AUTH, failure, success, checkTimeout} from './actions.js';
export const GET_BLOGS = {REQUEST: 'GET_BLOGS', SUCCESS: 'GET_BLOGS_SUCCESS', FAIL: 'GET_BLOGS_FAIL'};


/* Retrives list of 19th-hole blog posts */
/* Specifying an admin token will retrieve future blogs as well as current */
export function getBlogs(token = null){
    return (dispatch) => {
        dispatch({type: GET_BLOGS.REQUEST});
        return fetch(BASEURL+'blogs', {
            method: 'GET',
            headers: (!token ? {} : {
                [AUTH]: 'Bearer ' + token
            }) 
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_BLOGS.SUCCESS, json)))
                    //.then((response) => AsyncStorage.setItem('@SwingEssentials:blogs', JSON.stringify(response.data)));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(GET_BLOGS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}