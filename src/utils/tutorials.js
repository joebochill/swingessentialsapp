import {AsyncStorage } from 'react-native';
import {checkVersionGreater} from '../utils/utils';
import {ASYNC_PREFIX, TUTORIALS, TUTORIAL_VERSIONS} from '../constants/index';
import {tutorialNew} from '../actions/TutorialActions';

export function loadTutorials(dispatch){
    const keys = [
        ASYNC_PREFIX+TUTORIALS.LESSON_LIST,
        ASYNC_PREFIX+TUTORIALS.LESSON,
        ASYNC_PREFIX+TUTORIALS.SUBMIT_SWING,
        ASYNC_PREFIX+TUTORIALS.ORDER
    ];

    AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];
            switch(key){
                case keys[0]:{
                    if(!checkVersionGreater(value, TUTORIAL_VERSIONS.LESSON_LIST)){
                        dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                    }
                }
                case keys[1]:{
                    if(!checkVersionGreater(value, TUTORIAL_VERSIONS.LESSON)){
                        dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                    }
                }
                case keys[2]:{
                    if(!checkVersionGreater(value, TUTORIAL_VERSIONS.SUBMIT_SWING)){
                        dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                    }
                }
                case keys[3]:{
                    if(!checkVersionGreater(value, TUTORIAL_VERSIONS.ORDER)){
                        dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                    }
                }
                default:
                    return;
            }              
        });
    });
}