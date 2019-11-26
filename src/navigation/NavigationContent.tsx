import { ROUTES } from '../constants/routes';
type RouteGroup = {
    name: string;
    data: Array<Route>;
}
type Route = {
    title: string;
    icon: string;
    route?: string;
    iconType?: string;
    nested?: boolean;
    activatePanel?: number;
}

export const mainNavigationItems: RouteGroup = {
    name: 'main',
    data: [
        {
            title: 'Home',
            icon: 'home',
            route: ROUTES.HOME
        },
        {
            title: 'Your Lessons',
            icon: 'subscriptions',
            route: ROUTES.LESSONS
        },
        {
            title: 'Submit Your Swing',
            icon: 'videocam',
            route: ROUTES.SUBMIT_GROUP
        },
        {
            title: 'Order More',
            icon: 'shopping-cart',
            route: ROUTES.ORDER
        },
        {
            title: 'Tip of the Month',
            iconType: 'material-community',
            icon: 'calendar-today',
            route: ROUTES.TIPS_GROUP
        },
        {
            title: '19th Hole',
            iconType: 'material-community',
            icon: 'beer',
            route: ROUTES.BLOGS_GROUP
        },
        {
            title: 'My Account',
            icon: 'person',
            nested: true,
            activatePanel: 1
        },
        {
            title: 'Help',
            icon: 'help',
            nested: true,
            activatePanel: 2
        },
    ]
}

export const helpNavigationItems: RouteGroup = {
    name: 'help',
    data: [
        {
            title: 'About',
            icon: 'info',
            route: ROUTES.ABOUT
        },
        {
            title: 'FAQ',
            icon: 'help',
            route: ROUTES.FAQ
        },
        {
            title: 'Contact Us',
            icon: 'mail',
            route: ROUTES.CONTACT
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            activatePanel: 0
        },
    ]
}

export const accountNavigationItems: RouteGroup = {
    name: 'account',
    data: [
        {
            title: 'Account Details',
            icon: 'person',
            route: ROUTES.ACCOUNT_DETAILS
        },
        {
            title: 'Order History',
            icon: 'receipt',
            route: ROUTES.HISTORY
        },
        {
            title: 'Error Logs',
            icon: 'list',
            route: ROUTES.LOGS
        },
        {
            title: 'Settings',
            icon: 'settings',
            route: ROUTES.SETTINGS
        },
        {
            title: 'Log Out',
            iconType: 'material-community',
            icon: 'logout-variant',
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            activatePanel: 0
        },
    ]
}

export const NavigationItems = [
    mainNavigationItems,
    accountNavigationItems,
    helpNavigationItems
]