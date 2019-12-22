import { ROUTES } from '../constants/routes';
type RouteGroup = {
    name: string;
    data: Array<Route>;
};
type Route = {
    title: string;
    icon: string;
    route?: string;
    iconType?: string;
    nested?: boolean;
    private?: boolean;
    activatePanel?: number;
    onPress?: Function;
};

export const mainNavigationItems: RouteGroup = {
    name: 'main',
    data: [
        {
            title: 'Home',
            icon: 'home',
            route: ROUTES.HOME,
        },
        {
            title: 'Your Lessons',
            icon: 'subscriptions',
            route: ROUTES.LESSONS,
        },
        {
            title: 'Submit Your Swing',
            icon: 'videocam',
            route: ROUTES.SUBMIT_GROUP,
        },
        {
            title: 'Order More',
            icon: 'shopping-cart',
            route: ROUTES.ORDER,
        },
        {
            title: 'Tip of the Month',
            iconType: 'material-community',
            icon: 'calendar-today',
            route: ROUTES.TIPS_GROUP,
        },
        {
            title: '19th Hole',
            iconType: 'material-community',
            icon: 'beer',
            route: ROUTES.BLOGS_GROUP,
        },
        {
            title: 'My Account',
            icon: 'person',
            nested: true,
            private: true,
            activatePanel: 1,
        },
        {
            title: 'Settings',
            icon: 'settings',
            private: true,
            route: ROUTES.SETTINGS_GROUP,
        },
        {
            title: 'Help',
            icon: 'help',
            nested: true,
            activatePanel: 2,
        },
    ],
};

export const helpNavigationItems: RouteGroup = {
    name: 'help',
    data: [
        {
            title: 'About',
            icon: 'info',
            route: ROUTES.ABOUT,
        },
        {
            title: 'FAQ',
            icon: 'help',
            route: ROUTES.FAQ,
        },
        {
            title: 'Contact Us',
            icon: 'mail',
            route: ROUTES.CONTACT,
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            activatePanel: 0,
        },
    ],
};

export const accountNavigationItems: RouteGroup = {
    name: 'account',
    data: [
        {
            title: 'Account Details',
            icon: 'person',
            private: true,
            route: ROUTES.ACCOUNT_DETAILS,
        },
        {
            title: 'Order History',
            icon: 'receipt',
            private: true,
            route: ROUTES.HISTORY,
        },
        {
            title: 'Error Logs',
            icon: 'list',
            private: true,
            route: ROUTES.LOGS,
        },
        {
            title: 'Settings',
            icon: 'settings',
            private: true,
            route: ROUTES.SETTINGS,
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            activatePanel: 0,
        },
    ],
};

export const NavigationItems = [mainNavigationItems, accountNavigationItems, helpNavigationItems];
