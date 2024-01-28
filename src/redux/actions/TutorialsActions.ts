import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_VERSION, ASYNC_PREFIX, TUTORIALS, TUTORIAL_VERSIONS } from '../../constants/index';
import { MARK_TUTORIAL } from './types';
import { ThunkDispatch } from 'redux-thunk';
import { checkVersionGreater } from '../../utilities';
import { TutorialsState } from '../../__types__';

/* Updates the store and AsyncStorage so that a tutorial is only shown once */
export function tutorialViewed(tutorial: string) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: MARK_TUTORIAL.VIEWED, data: tutorial });
        void AsyncStorage.setItem(ASYNC_PREFIX + tutorial, APP_VERSION);
    };
}

/* Sets the specified tutorial to show */
export function tutorialNew(tutorial: string) {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        dispatch({ type: MARK_TUTORIAL.NEW, data: tutorial });
    };
}

export function loadTutorials() {
    return (dispatch: ThunkDispatch<any, void, any>): void => {
        const initialKeys: Array<keyof typeof TUTORIALS> = ['lessonList', 'lesson', 'submit', 'order', 'home'];
        const keys = initialKeys.map((item) => ASYNC_PREFIX + TUTORIALS[item]);
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        void AsyncStorage.multiGet(keys, (err, stores): void => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            stores?.map((item, i, store): void => {
                const key = item[0];
                const value = item[1];

                if (!checkVersionGreater(value as string, TUTORIAL_VERSIONS[initialKeys[i]])) {
                    dispatch(tutorialNew(key.replace(ASYNC_PREFIX, '')));
                }
            });
        });
    };
}
