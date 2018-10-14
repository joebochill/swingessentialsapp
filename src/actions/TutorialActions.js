import { AsyncStorage } from 'react-native';
import {APP_VERSION, ASYNC_PREFIX} from '../constants/index';

/* Constants */
// import {BASEURL, AUTH, failure, success, checkTimeout} from './actions.js';
export const MARK_TUTORIAL = {VIEWED: 'MARK_TUTORIAL_VIEWED', NEW: 'MARK_TUTORIAL_NEW'};


/* Updates the store and AsyncStorage so that a tutorial is only shown once */
export function tutorialViewed(tutorial){
    return (dispatch) => {
        dispatch({type: MARK_TUTORIAL.VIEWED, data: tutorial});
        AsyncStorage.setItem(ASYNC_PREFIX+tutorial, APP_VERSION);
    }
}

/* Sets the specified tutorial to show */
export function tutorialNew(tutorial){
    return (dispatch) => {
        dispatch({type: MARK_TUTORIAL.NEW, data: tutorial});
    }
}