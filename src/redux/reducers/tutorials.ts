import { MARK_TUTORIAL } from '../actions/types';
import { TutorialsState } from '../../__types__';
import { TUTORIALS } from '../../constants';
import { ReducerAction } from '.';

// @ts-ignore
const initialState: TutorialsState = {
    [TUTORIALS.lessonList]: false,
    [TUTORIALS.lesson]: false,
    [TUTORIALS.submit]: false,
    [TUTORIALS.order]: false,
    [TUTORIALS.home]: false,
};
export const tutorialReducer = (state = initialState, action: ReducerAction): TutorialsState => {
    switch (action.type) {
        case MARK_TUTORIAL.VIEWED:
            return {
                ...state,
                // @ts-ignore
                [action.data]: false,
            };
        case MARK_TUTORIAL.NEW:
            return {
                ...state,
                // @ts-ignore
                [action.data]: true,
            };
        default:
            return state;
    }
};
