import { GET_SETTINGS, LOGOUT, TOKEN_TIMEOUT } from '../OLD_actions/types';
import { SettingsState } from '../../__types__';
import { ReducerAction } from '.';

const initialState: SettingsState = {
    loading: false,
    duration: 5,
    delay: 5,
    overlay: true,
    handedness: 'right',
    notifications: {
        lessons: true,
        marketing: true,
        newsletter: true,
        reminders: true,
    },
    avatar: '',
};

export const settingsReducer = (state = initialState, action: ReducerAction): SettingsState => {
    switch (action.type) {
        case GET_SETTINGS.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_SETTINGS.SUCCESS:
            return {
                ...state,
                loading: false,
                delay: action.payload.camera.delay,
                duration: action.payload.camera.duration,
                overlay: !!action.payload.camera.overlay,
                handedness: action.payload.handed.toLowerCase(),
                notifications: action.payload.notifications,
                avatar: action.payload.avatar,
            };
        case GET_SETTINGS.FAILURE:
            return {
                ...state,
                loading: false,
            };
        case LOGOUT.SUCCESS:
        case LOGOUT.FAILURE:
        case TOKEN_TIMEOUT:
            return initialState;
        default:
            return state;
    }
};
