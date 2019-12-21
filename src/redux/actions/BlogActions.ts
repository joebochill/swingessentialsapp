import { HttpRequest } from '../../api/http';
import { success, failure } from '../../api/http-helper';
import { Dispatch } from 'redux';
import * as ACTIONS from './types';

export function loadBlogs() {
    return (dispatch: Dispatch) => {
        dispatch({ type: ACTIONS.GET_BLOGS.REQUEST });

        HttpRequest.get(ACTIONS.GET_BLOGS.API)
            .onSuccess((body: any) => {
                dispatch(success(ACTIONS.GET_BLOGS.SUCCESS, body));
            })
            .onFailure((response: Response) => {
                dispatch(failure(ACTIONS.GET_BLOGS.FAILURE, response, 'Load19Hole'));
            })
            .request();
    };
}
