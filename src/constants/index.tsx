import { Platform } from 'react-native';
import { width } from '../utilities/dimensions';

// Get the app version from package.json
export { version as APP_VERSION } from '../../package.json';
export const ASYNC_PREFIX = '@SwingEssentials:';
export const ERROR_FILE = 'error_log.txt';
export const ERROR_FILE_SIZE_LIMIT = 24000; // bytes

export const DRAWER_WIDTH = 0.9 * width;

// REAL DEVICE
// export const BASE_URL_REAL_DEVICE = 'http://192.168.1.163:3000';
// export const BASE_URL_API_REAL_DEVICE = 'http://192.168.1.163:3000';
// SIMULATOR
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const BASE_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
// STAGING
// export const BASE_URL = 'https://staging.swingessentials.com';
// export const BASE_API_URL = 'https://staging.swingessentials.com/api/v2';
// PRODUCTION
// export const BASE_URL = 'https://www.swingessentials.com';
// export const BASE_API_URL = 'https://www.swingessentials.com/api/v2';
export const AUTH = 'Message';

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const TUTORIAL_KEYS = {
    LESSON_LIST: 'lessonList',
    LESSON: 'lesson',
    SUBMIT_SWING: 'submit',
    ORDER: 'order',
    HOME: 'home',
};

export const TUTORIALS = {
    [TUTORIAL_KEYS.LESSON_LIST]: 'tutorial_lesson_list',
    [TUTORIAL_KEYS.LESSON]: 'tutorial_lesson',
    [TUTORIAL_KEYS.SUBMIT_SWING]: 'tutorial_submit_swing',
    [TUTORIAL_KEYS.ORDER]: 'tutorial_order',
    [TUTORIAL_KEYS.HOME]: 'tutorial_home',
};

export const TUTORIAL_VERSIONS = {
    [TUTORIAL_KEYS.LESSON_LIST]: '3.0.1',
    [TUTORIAL_KEYS.LESSON]: '3.0.1',
    [TUTORIAL_KEYS.SUBMIT_SWING]: '3.0.1',
    [TUTORIAL_KEYS.ORDER]: '3.0.1',
    [TUTORIAL_KEYS.HOME]: '3.0.1',
};
