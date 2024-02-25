import { width } from '../utilities/dimensions';

export const APP_VERSION = '4.0.0-build.14';
export const ASYNC_PREFIX = '@SwingEssentials:';
export const ERROR_FILE = 'error_log.txt';
export const LOG_FILE = 'message_log.txt';
export const ERROR_LIMIT = 8000; // characters
export const LOG_LIMIT = 24000; // characters

export const DRAWER_WIDTH = 0.9 * width;

export const BASEURL_DEV = 'https://www.swingessentials.com/dev_apis/swingessentials.php';
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
    [TUTORIAL_KEYS.LESSON_LIST]: '3.0.1',
    [TUTORIAL_KEYS.LESSON]: '3.0.1',
    [TUTORIAL_KEYS.SUBMIT_SWING]: '3.0.1',
    [TUTORIAL_KEYS.ORDER]: '3.0.1',
    [TUTORIAL_KEYS.HOME]: '3.0.1',
};
