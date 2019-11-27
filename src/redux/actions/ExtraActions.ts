import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';
import { loadTips, /*loadBlogs, loadPackages*/ } from './index';

export function loadInitialData() {
    console.log('loading initial data');
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.INITIAL_LOAD });
        dispatch(loadTips());
        // dispatch(loadBlogs());
        // dispatch(loadPackages());
    }
}