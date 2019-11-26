import { HttpRequest } from '../../api/http';
import { Dispatch } from 'redux';

export function loadTips(){
    return (dispatch: Dispatch) => {
        HttpRequest.get('tips')
        .onSuccess((body: any) => {
            console.log(body[0]);
        }).request();
    }
}

export function loadLessons(){
    return (dispatch: Dispatch) => {
        HttpRequest.get('lessons')
        .onSuccess((body: any) => {
            console.log(body);
            // dispatch({})
        })
        .onFailure((response: Response) => {
            console.log('FAILURE');
        })
        .request();
    }
}