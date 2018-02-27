/* Constants */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export const TOKEN_TIMEOUT = 'TOKEN_TIMEOUT';

export const GET_TIPS = {REQUEST: 'GET_TIPS', SUCCESS: 'GET_TIPS_SUCCESS', FAIL: 'GET_TIPS_FAIL'};
export const UPDATE_TIP = {REQUEST: 'UPDATE_TIP', SUCCESS: 'UPDATE_TIP_SUCCESS', FAIL: 'UPDATE_TIP_FAIL'};
export const ADD_TIP = {REQUEST: 'ADD_TIP', SUCCESS: 'ADD_TIP_SUCCESS', FAIL: 'ADD_TIP_FAIL'};
export const REMOVE_TIP = {REQUEST: 'REMOVE_TIP', SUCCESS: 'REMOVE_TIP_SUCCESS', FAIL: 'REMOVE_TIP_FAIL'};

export const GET_BLOGS = {REQUEST: 'GET_BLOGS', SUCCESS: 'GET_BLOGS_SUCCESS', FAIL: 'GET_BLOGS_FAIL'};
export const GET_PACKAGES = {REQUEST: 'GET_PACKAGES', SUCCESS: 'GET_PACKAGES_SUCCESS', FAIL: 'GET_PACKAGES_FAIL'};
export const UPDATE_BLOGS = {REQUEST: 'UPDATE_BLOG', SUCCESS: 'UPDATE_BLOG_SUCCESS', FAIL: 'UPDATE_BLOG_FAIL'};
export const ADD_BLOG = {REQUEST: 'ADD_BLOG', SUCCESS: 'ADD_BLOG_SUCCESS', FAIL: 'ADD_BLOG_FAIL'};
export const REMOVE_BLOG = {REQUEST: 'REMOVE_BLOG', SUCCESS: 'REMOVE_BLOG_SUCCESS', FAIL: 'REMOVE_BLOG_FAIL'};
// export const PING = {REQUEST: 'PING_REQUEST', SUCCESS: 'PING_SUCCESS', FAIL: 'PING_FAIL'};

/* Base URL for fetch commands */
// export const BASEURL = 'http://www.josephpboyle.com/api/swingessentialsapi.php/';
// export const BASEURL = 'https://www.swingessentials.com/apis/swingessentials.php/';
export const BASEURL = 'http://www.josephpboyle.com/api/swingessentials2.php/';


//const API_KEY = 'AIzaSyAzvggwVpvJ1pngsjQKJ84FcY8v07C8dNA';
//const googleURL = 'https://www.googleapis.com/upload/storage/v1/b/www.joebochill.com/';

/* Retrieves List of Tips-of-the-month */
export function getTips(token=null){
    return (dispatch) => {
        dispatch({type: GET_TIPS.REQUEST});
        return fetch(BASEURL+'tips', {
            method: 'GET',
            headers: (!token ? {} : {
                'Authorization': 'Bearer ' + token
            }) 
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_TIPS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('tips',JSON.stringify(response.data)));
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

/* Updates the specified tip's details */
export function updateTip(token, tip){
    return (dispatch) => {
        dispatch({type: UPDATE_TIP.REQUEST});
        return fetch(BASEURL+'tip', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(tip)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(UPDATE_TIP.SUCCESS));
                    dispatch(getTips(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(UPDATE_TIP.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Adds a new tip of the month to the database */
export function addTip(token, tip){
    return (dispatch) => {
        dispatch({type: ADD_TIP.REQUEST});
        return fetch(BASEURL+'tip', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(tip)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(ADD_TIP.SUCCESS));
                    dispatch(getTips(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ADD_TIP.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Removes a tip of the month from the database */
export function removeTip(token, tip){
    return (dispatch) => {
        dispatch({type: REMOVE_TIP.REQUEST});
        return fetch(BASEURL+'removetip', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(tip)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(REMOVE_TIP.SUCCESS));
                    dispatch(getTips(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REMOVE_TIP.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Retrives list of 19th-hole blog posts */
export function getBlogs(token = null){
    return (dispatch) => {
        dispatch({type: GET_BLOGS.REQUEST});
        return fetch(BASEURL+'blogs', {
            method: 'GET',
            headers: (!token ? {} : {
                'Authorization': 'Bearer ' + token
            }) 
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_BLOGS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('blogs',JSON.stringify(response.data)));
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

/* Updates the specified blog's details */
export function updateBlog(token, blog){
    return (dispatch) => {
        dispatch({type: UPDATE_BLOGS.REQUEST});
        return fetch(BASEURL+'blog', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(blog)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(UPDATE_BLOGS.SUCCESS));
                    dispatch(getBlogs(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(UPDATE_BLOGS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Adds a new blog post to the database */
export function addBlog(token, blog){
    return (dispatch) => {
        dispatch({type: ADD_BLOG.REQUEST});
        return fetch(BASEURL+'blog', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(blog)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(ADD_BLOG.SUCCESS));
                    dispatch(getBlogs(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(ADD_BLOG.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

/* Removes a new blog post from the database */
export function removeBlog(token, blog){
    return (dispatch) => {
        dispatch({type: REMOVE_BLOG.REQUEST});
        return fetch(BASEURL+'removeblog', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(blog)
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(REMOVE_BLOG.SUCCESS));
                    dispatch(getBlogs(token));
                    break;
                default:
                    checkTimeout(response, dispatch);
                    dispatch(failure(REMOVE_BLOG.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

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

