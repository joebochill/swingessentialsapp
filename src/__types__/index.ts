/* eslint-disable @typescript-eslint/naming-convention */
export type HandednessType = 'right' | 'left';
export type CameraType = 'front' | 'back';
export type SwingType = 'dtl' | 'fo';
export type UserRole = 'administrator' | 'anonymous' | 'customer' | 'pending';
export type NavType = 'menu' | 'back' | 'none';
export type LessonType = 'in-person' | 'single';

export type UserSettingsType = {
    duration?: number;
    delay?: number;
    overlay?: boolean;
    handedness?: HandednessType;
    avatar?: string;
    notifications?: string;
};

export type Credentials = {
    username: string;
    password: string;
};
export type Blog = {
    id: string | number;
    date: string;
    title: string;
    body: string;
};

export type Lesson = {
    dtl_swing: string;
    fo_swing: string;
    request_date: string;
    request_id: number;
    request_notes: string;
    request_url: string;
    response_notes: string;
    response_status: 'good' | 'bad';
    response_video: string;
    type: LessonType;
    username?: string;
    viewed: number | boolean;
};

export type Package = {
    // TODO: update API to return proper types for numbers
    id: string | number;
    name: string;
    description: string;
    shortcode: string;
    count: string | number;
    duration: string | number;
    price: string | number;
    app_sku: string;
};
export type Tip = {
    id: string | number;
    date: string;
    title: string;
    video: string;
    comments: string;
};

// Redux State Types
export type LoginState = {
    token: string | null;
    admin: boolean;
    role: UserRole;
    modalWarning: boolean;
    failCount: number;
    pending: boolean;
};
export type LessonsState = {
    loading: boolean;
    pending: Lesson[];
    closed: Lesson[];
    redeemPending: boolean;
    redeemSuccess: boolean;
    redeemError: number | null;
};
export type TipsState = {
    loading: boolean;
    tipList: Tip[];
};
export type UserDataState = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    joined: number;
    location?: string;
    phone?: string;
};
export type CreditsState = {
    count: number;
    inProgress: boolean;
    success: boolean;
    fail: boolean;
};
export type BlogsState = {
    loading: boolean;
    blogList: Blog[];
};
export type PackagesState = {
    list: Package[];
    loading: boolean;
};
export type SettingsState = {
    loading: boolean;
    duration: number;
    delay: number;
    overlay: boolean;
    handedness: HandednessType;
    notifications: boolean;
    avatar: string;
};
export type RegistrationState = {
    pending: boolean;
    userAvailable: boolean;
    emailAvailable: boolean;
    success: boolean;
    emailVerified: boolean;
    error: number;
};
export type FAQ = {
    id: number;
    question: string;
    platform_specific: boolean;
    answer: string;
    answer_android: string;
    answer_ios: string;
    video: string;
};
export type FAQState = {
    loading: boolean;
    questions: FAQ[];
};
export type ConfigState = {
    placeholder: Lesson;
};

export type LogsState = {
    loading: boolean;
};

export type TutorialsState = {
    tutorial_lesson_list: boolean;
    tutorial_lesson: boolean;
    tutorial_submit_swing: boolean;
    tutorial_order: boolean;
    tutorial_home: boolean;
};

export type ApplicationState = {
    login: LoginState;
    lessons: LessonsState;
    tips: TipsState;
    userData: UserDataState;
    credits: CreditsState;
    blogs: BlogsState;
    packages: PackagesState;
    settings: SettingsState;
    registration: RegistrationState;
    faq: FAQState;
    config: ConfigState;
    logs: LogsState;
    tutorials: TutorialsState;
};
