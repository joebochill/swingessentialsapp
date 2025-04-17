import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CardStyleInterpolators, createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { ROUTES } from '../constants/routes';
import BootSplash from 'react-native-bootsplash';
import { width } from '../utilities/dimensions';
import { DrawerContent } from './DrawerContent';
import { About, Blogs, FAQ, ForgotPassword, Home, Lessons, Login, Register, SingleBlog, SingleLesson, SingleTip, Tips } from '../screens';

const linkingConfig: LinkingOptions<RootDrawerParamList> = {
    prefixes: ['https://www.swingessentials.com'],
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
    [ROUTES.RECORD]: undefined;
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
        setting: any;
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

        <AppStack.Screen name={ROUTES.SUBMIT} component={Home} /> 
        <AppStack.Screen name={ROUTES.RECORD} component={Home} />
        <AppStack.Screen name={ROUTES.ORDER} component={Home} />

        <AppStack.Screen name={ROUTES.BLOGS} component={Blogs} />
        <AppStack.Screen name={ROUTES.BLOG} component={SingleBlog} />

        <AppStack.Screen name={ROUTES.TIPS} component={Tips} />
        <AppStack.Screen name={ROUTES.TIP} component={SingleTip} />

        <AppStack.Screen name={ROUTES.ABOUT} component={About} />
        <AppStack.Screen name={ROUTES.FAQ} component={FAQ} />

        <AppStack.Screen name={ROUTES.PROS} component={Home} />

        <AppStack.Screen name={ROUTES.LOGS} component={Home} />

        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsStackNavigator} />
    </AppStack.Navigator>
);

const SettingsStackNavigator = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen name={ROUTES.SETTINGS} component={Home} />
        <SettingsStack.Screen name={ROUTES.SETTING} component={Home} />
    </SettingsStack.Navigator>
);

export const MainNavigation = () => (
    <NavigationContainer
        onReady={() => {
            void BootSplash.hide({ fade: true });
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
