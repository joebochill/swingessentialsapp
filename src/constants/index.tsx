export const YOUTUBE_API_KEY = 'AIzaSyBLUJUqz7E3Z5XNcXbMYO9gVmXd0zYAR4U';

export const APP_VERSION = '3.0.0';
export const ASYNC_PREFIX = '@SwingEssentials:';

export const BASEURL_DEV = 'https://www.swingessentials.com/apis/dev/dev.php';
export const BASEURL_PROD = 'https://www.swingessentials.com/apis/swingessentials.php';

export const BASEURL = BASEURL_DEV;
export const AUTH = 'Message';

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const TUTORIAL_KEYS = {
    LESSON_LIST: 'LESSON_LIST',
    LESSON: 'LESSON',
    SUBMIT_SWING: 'SUBMIT_SWING',
    ORDER: 'ORDER',
};

export const TUTORIALS = {
    [TUTORIAL_KEYS.LESSON_LIST]: 'tutorial_lesson_list',
    [TUTORIAL_KEYS.LESSON]: 'tutorial_lesson',
    [TUTORIAL_KEYS.SUBMIT_SWING]: 'tutorial_submit_swing',
    [TUTORIAL_KEYS.ORDER]: 'tutorial_order',
};

export const TUTORIAL_VERSIONS = {
    [TUTORIAL_KEYS.LESSON_LIST]: '2.1.0',
    [TUTORIAL_KEYS.LESSON]: '2.1.0',
    [TUTORIAL_KEYS.SUBMIT_SWING]: '2.1.0',
    [TUTORIAL_KEYS.ORDER]: '2.1.0',
};
