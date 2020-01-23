import { getStatusBarHeight } from 'react-native-status-bar-height';
import { width } from '../utilities/dimensions';
import { unit } from '../styles/sizes';

export const YOUTUBE_API_KEY = 'AIzaSyBLUJUqz7E3Z5XNcXbMYO9gVmXd0zYAR4U';

export const APP_VERSION = '3.0.1';
export const ASYNC_PREFIX = '@SwingEssentials:';
export const ERROR_FILE = 'error_log.txt';
export const LOG_FILE = 'message_log.txt';
export const ERROR_LIMIT = 8000; // characters
export const LOG_LIMIT = 24000; // characters

export const HEADER_EXPANDED_HEIGHT = unit(200) + getStatusBarHeight(true);
export const HEADER_COLLAPSED_HEIGHT = unit(56) + getStatusBarHeight(true);
export const HEADER_EXPANDED_HEIGHT_NO_STATUS = unit(200);
export const HEADER_COLLAPSED_HEIGHT_NO_STATUS = unit(56);
export const DRAWER_WIDTH = 0.9 * width;

export const BASEURL_DEV = 'https://www.swingessentials.com/apis/dev/dev.php';
export const BASEURL_PROD = 'https://www.swingessentials.com/apis/swingessentials.php';

export const BASEURL = BASEURL_PROD;
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
    [TUTORIAL_KEYS.LESSON_LIST]: '3.0.0',
    [TUTORIAL_KEYS.LESSON]: '3.0.0',
    [TUTORIAL_KEYS.SUBMIT_SWING]: '3.0.0',
    [TUTORIAL_KEYS.ORDER]: '3.0.0',
    [TUTORIAL_KEYS.HOME]: '3.0.0',
};
