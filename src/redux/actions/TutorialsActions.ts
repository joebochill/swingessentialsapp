import { AsyncStorage } from 'react-native';
import { APP_VERSION, ASYNC_PREFIX, TUTORIALS, TUTORIAL_VERSIONS } from '../../constants/index';
import { MARK_TUTORIAL } from './types';
import { ThunkDispatch } from 'redux-thunk';
import { checkVersionGreater } from '../../utilities';
import { TutorialsState } from '../../__types__';

export function loadTutorials() {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        const _keys: Array<keyof TutorialsState> = ['lessonList', 'lesson', 'submit', 'order', 'home'];
        const keys = _keys.map(item => ASYNC_PREFIX + TUTORIALS[item]);
        AsyncStorage.multiGet(keys, (err, stores) => {
            stores.map((item, i, store) => {
                let key = item[0];
                let value = item[1];
                if (!checkVersionGreater(value, TUTORIAL_VERSIONS[_keys[i]])) {
                    dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                }
            });
        });
    };
}

/* Updates the store and AsyncStorage so that a tutorial is only shown once */
export function tutorialViewed(tutorial: string) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: MARK_TUTORIAL.VIEWED, data: tutorial });
        AsyncStorage.setItem(ASYNC_PREFIX + tutorial, APP_VERSION);
    };
}

/* Sets the specified tutorial to show */
export function tutorialNew(tutorial: string) {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: MARK_TUTORIAL.NEW, data: tutorial });
    };
}
