export type HandednessType = 'right' | 'left';
export type CameraType = 'front' | 'back';
export type SwingType = 'dtl' | 'fo';
export type UserRole = 'administrator' | 'anonymous' | 'customer' | 'pending';
export type NavType = 'menu' | 'back';

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
export type Blog = any; // TODO
export type Lesson = any; // TODO
export type Package = any; // TODO
export type Tip = any; // TODO

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
};
