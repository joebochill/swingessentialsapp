import { MARK_TUTORIAL } from '../OLD_actions/types';
import { TutorialsState } from '../../__types__';
import { TUTORIALS } from '../../constants';
import { ReducerAction } from '.';

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
                [action.data]: false,
            };
        case MARK_TUTORIAL.NEW:
            return {
                ...state,
                [action.data]: true,
            };
        default:
            return state;
    }
};
