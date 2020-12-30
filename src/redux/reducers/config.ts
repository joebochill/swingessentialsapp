import { GET_CONFIG } from '../actions/types';
import { ConfigState } from '../../__types__';
import { PlaceholderLesson } from '../../constants/lessons';

const initialState: ConfigState = {
    placeholder: PlaceholderLesson,
};
export const configReducer = (state = initialState, action): ConfigState => {
    switch (action.type) {
        case GET_CONFIG.SUCCESS:
            return {
                placeholder: {
                    ...PlaceholderLesson,
                    response_video: action.payload.placeholder_video,
                    response_notes: action.payload.description || PlaceholderLesson.response_notes,
                },
            };
        case GET_CONFIG.FAILURE:
            return {
                placeholder: PlaceholderLesson,
            };
        default:
            return state;
    }
};
