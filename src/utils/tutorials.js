import {AsyncStorage } from 'react-native';
import {checkVersionGreater} from '../utils/utils';
import {ASYNC_PREFIX, TUTORIAL_KEYS, TUTORIALS, TUTORIAL_VERSIONS} from '../constants/index';
import {tutorialNew} from '../actions/TutorialActions';

export function loadTutorials(dispatch){
    const _keys = [TUTORIAL_KEYS.LESSON_LIST, TUTORIAL_KEYS.LESSON, TUTORIAL_KEYS.SUBMIT_SWING, TUTORIAL_KEYS.ORDER];
    const keys = _keys.map((item) => ASYNC_PREFIX+TUTORIALS[item]);

    AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((item, i, store) => {
            let key = item[0];
            let value = item[1];
            if(!checkVersionGreater(value, TUTORIAL_VERSIONS[_keys[i]])){
                dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
            }            
        });
    });
}