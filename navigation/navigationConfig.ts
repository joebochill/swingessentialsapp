import { IconProps } from '@/components/common/Icon';
import * as Linking from 'expo-linking';
import type { LinkProps } from 'expo-router';

type RouteGroup = {
    name: string;
    data: Route[];
};
export type Route = {
    title: string;
    icon: IconProps['name'];
    route?: LinkProps['href'];
    screen?: string;
    iconType?: string;
    nested?: boolean;
    private?: boolean;
    activatePanel?: number;
    onPress?: () => void;
};

export const mainNavigationItems: RouteGroup = {
    name: 'main',
    data: [
        {
            title: 'Home',
            icon: 'home',
            route: '/(drawer)/(screens)/home',
        },
        {
            title: 'Your Profile',
            icon: 'person',
            private: true,
            route: '/(drawer)/(screens)/settings',
        },
        {
            title: 'Your Lessons',
            icon: 'subscriptions',
            route: '/(drawer)/(screens)/lessons',
        },
        {
            title: 'Submit Your Swing',
            icon: 'videocam',
            route: '/(drawer)/(screens)/(submit)',
        },
        {
            title: 'Order More',
            icon: 'shopping-cart',
            route: '/(drawer)/(screens)/order',
        },
        {
            title: 'Meet Our Pros',
            icon: 'face',
            route: '/(drawer)/(screens)/pros',
        },
        {
            title: 'Tip of the Month',
            icon: 'today',
            route: '/(drawer)/(screens)/tips',
        },
        {
            title: 'The 19th Hole',
            icon: 'local-bar',
            route: '/(drawer)/(screens)/19th-hole',
        },
        {
            title: 'Help',
            icon: 'help',
            nested: true,
            activatePanel: 1,
        },
    ],
};

export const helpNavigationItems: RouteGroup = {
    name: 'help',
    data: [
        {
            title: 'About',
            icon: 'info',
            route: '/(drawer)/(screens)/(help)/about',
        },
        {
            title: 'FAQ',
            icon: 'help',
            route: '/(drawer)/(screens)/(help)/faq',
        },
        {
            title: 'Contact Us',
            icon: 'mail',
            onPress: (): void => {
                Linking.openURL('mailto:info@swingessentials.com?subject=Swing%20Essentials%20App%20Feedback');
            },
        },
        {
            title: 'Error Logs',
            icon: 'report-problem',
            private: true,
            route: '/(drawer)/(screens)/(help)/logs',
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            activatePanel: 0,
        },
    ],
};

export const NavigationItems = [mainNavigationItems, helpNavigationItems];
