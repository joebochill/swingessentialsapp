export type HandednessType = 'right' | 'left';
export type CameraType = 'front' | 'back';
export type SwingType = 'dtl' | 'fo';
export type UserRole = 'administrator' | 'anonymous' | 'customer' | 'pending';
export type NavType = 'menu' | 'back' | 'none';
export type LessonType = 'in-person' | 'single';

export type ColorDef = {
    50: string,
    100: string,
    200: string,
    300: string,
    400: string,
    500: string,
    600: string,
    700: string,
    800: string,
    900: string,
    A100?: string,
    A200?: string,
    A400?: string,
    A700?: string,
    contrastDefaultColor?: string
}
export type UserSettingsType = {
    duration?: number;
    delay?: number;
    overlay?: boolean;
    handedness?: HandednessType;
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
};
export type CreditsState = {
    count: number;
    // unlimited: number,
    // unlimitedExpires: number,
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
};
export type RegistrationState = {
    pending: boolean;
    userAvailable: boolean;
    // lastUserChecked: string;
    emailAvailable: boolean;
    // lastEmailChecked: string;
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

export type LogsState = {
    loading: boolean;
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
    logs: LogsState;
};
