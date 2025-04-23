import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { ROUTES } from './routeConfig';
import BootSplash from 'react-native-bootsplash';
import { width } from '../utilities/dimensions';
import { DrawerContent } from './DrawerContent';
import { UserAppSettings, UserNotificationSettings } from '../redux/apiServices/userDetailsService';
import { BASE_URL } from '../_config';
import {
    About,
    Blogs,
    ErrorLogs,
    FAQ,
    ForgotPassword,
    Home,
    Lessons,
    Login,
    Order,
    Pros,
    Record,
    Register,
    Settings,
    SingleBlog,
    SingleLesson,
    SingleSetting,
    SingleTip,
    Submit,
    Tips,
} from '../components/screens';

const linkingConfig: LinkingOptions<RootDrawerParamList> = {
    prefixes: [BASE_URL],
    config: {
        screens: {
            APP: {
                screens: {
                    [ROUTES.REGISTER]: 'register/:code?',
                    [ROUTES.LESSONS]: 'lessons',
                },
            },
        },
    },
};

// Define types for Stack Navigator
export type RootStackParamList = {
    [ROUTES.LOGIN]: undefined;
    [ROUTES.REGISTER]:
        | undefined
        | {
              code?: string;
          };
    [ROUTES.RESET_PASSWORD]: undefined;

    [ROUTES.HOME]: undefined;

    [ROUTES.LESSONS]: undefined;
    [ROUTES.LESSON]: {
        lesson: string | number | null;
    };

    [ROUTES.SUBMIT]: undefined;
    [ROUTES.RECORD]: {
        onReturn: (uri: string) => void;
        swing: 'fo' | 'dtl';
    };
    [ROUTES.ORDER]: undefined;

    [ROUTES.BLOGS]: undefined;
    [ROUTES.BLOG]: {
        blog: string | number;
    };

    [ROUTES.TIPS]: undefined;
    [ROUTES.TIP]: {
        tip: string | number;
    };

    [ROUTES.ABOUT]: undefined;
    [ROUTES.FAQ]: undefined;

    [ROUTES.PROS]: undefined;

    [ROUTES.LOGS]: undefined;

    [ROUTES.SETTINGS_GROUP]: undefined;
};
export type SettingsStackParamList = {
    [ROUTES.SETTINGS]: undefined;
    [ROUTES.SETTING]: {
        setting: keyof UserAppSettings | keyof UserNotificationSettings;
    };
};

// Define types for Drawer Navigator
export type RootDrawerParamList = {
    APP: undefined;
};

// Navigators
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const AppStack = createStackNavigator<RootStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

const MainStackNavigator = () => (
    <AppStack.Navigator
        initialRouteName={ROUTES.HOME}
        screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
    >
        <AppStack.Screen name={ROUTES.LOGIN} component={Login} />
        <AppStack.Screen name={ROUTES.REGISTER} component={Register} />
        <AppStack.Screen name={ROUTES.RESET_PASSWORD} component={ForgotPassword} />

        <AppStack.Screen name={ROUTES.HOME} component={Home} />

        <AppStack.Screen name={ROUTES.LESSONS} component={Lessons} />
        <AppStack.Screen name={ROUTES.LESSON} component={SingleLesson} />

        <AppStack.Screen name={ROUTES.SUBMIT} component={Submit} />
        <AppStack.Screen name={ROUTES.RECORD} component={Record} />
        <AppStack.Screen name={ROUTES.ORDER} component={Order} />

        <AppStack.Screen name={ROUTES.BLOGS} component={Blogs} />
        <AppStack.Screen name={ROUTES.BLOG} component={SingleBlog} />

        <AppStack.Screen name={ROUTES.TIPS} component={Tips} />
        <AppStack.Screen name={ROUTES.TIP} component={SingleTip} />

        <AppStack.Screen name={ROUTES.ABOUT} component={About} />
        <AppStack.Screen name={ROUTES.FAQ} component={FAQ} />

        <AppStack.Screen name={ROUTES.PROS} component={Pros} />

        <AppStack.Screen name={ROUTES.LOGS} component={ErrorLogs} />

        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsStackNavigator} />
    </AppStack.Navigator>
);

const SettingsStackNavigator = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen name={ROUTES.SETTINGS} component={Settings} />
        <SettingsStack.Screen name={ROUTES.SETTING} component={SingleSetting} />
    </SettingsStack.Navigator>
);

export const MainNavigation = () => {
    return (
        <NavigationContainer
            onReady={() => {
                BootSplash.hide({ fade: true });
            }}
            linking={linkingConfig}
        >
            <Drawer.Navigator
                initialRouteName={'APP'}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'slide',
                    drawerStyle: {
                        width: width * 0.9,
                    },
                }}
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="APP"
                    component={MainStackNavigator}
                    options={({ route }) => ({
                        swipeEnabled: ![ROUTES.LOGIN, ROUTES.RESET_PASSWORD, ROUTES.REGISTER].includes(
                            (getFocusedRouteNameFromRoute(route) as 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD') || ''
                        ),
                    })}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};
