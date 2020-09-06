import { Alert } from 'react-native';
import { ROUTES } from '../constants/routes';
import Mailer from 'react-native-mail';
import { Logger } from '../utilities/logging';

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
            title: 'Your Profile',
            icon: 'person',
            private: true,
            route: ROUTES.SETTINGS,
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
            icon: 'today',
            route: ROUTES.TIPS,
        },
        {
            title: 'The 19th Hole',
            icon: 'local-bar',
            route: ROUTES.BLOGS,
        },
        // {
        //     title: 'My Account',
        //     icon: 'person',
        //     nested: true,
        //     private: true,
        //     activatePanel: 1,
        // },
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
            onPress: () => {
                Mailer.mail(
                    {
                        subject: 'Swing Essentials App Feedback',
                        recipients: ['info@swingessentials.com'],
                        isHTML: true,
                    },
                    (error, event) => {
                        if (error && error === 'canceled') {
                            // Do nothing
                        } else if (error) {
                            Logger.logError({
                                code: 'CON100',
                                description: 'Error sending error logs',
                                rawErrorMessage: error,
                            });
                        } else if (event && event === 'sent') {
                            // message sent successfully
                            Alert.alert(
                                'Message Sent',
                                'Your message has been sent successfully. Thank you for helping us improve the app!',
                            );
                        } else if (event && (event === 'canceled' || event === 'cancelled' || event === 'cancel')) {
                            // do nothing
                        } else if (event) {
                            Logger.logError({
                                code: 'CON900',
                                description: 'Error sending feedback email. ',
                                rawErrorMessage: event,
                            });
                        }
                    },
                );
            },
            // route: ROUTES.CONTACT,
        },
        {
            title: 'Error Logs',
            icon: 'report-problem',
            private: true,
            route: ROUTES.LOGS,
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
        // {
        //     title: 'Account Details',
        //     icon: 'person',
        //     private: true,
        //     route: ROUTES.ACCOUNT_DETAILS,
        // },
        // {
        //     title: 'Order History',
        //     icon: 'receipt',
        //     private: true,
        //     route: ROUTES.HISTORY,
        // },
        {
            title: 'My Profile',
            icon: 'person',
            private: true,
            route: ROUTES.SETTINGS,
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
