import React from 'react';
// React-Navigation Components
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Constants
import { ROUTES } from '../constants/routes';

// Route Components
import { NavigationDrawer } from './NavigationDrawer';
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
    Record,
    Register,
    Settings,
    SingleBlog,
    SingleLesson,
    SingleSetting,
    SingleTip,
    Submit,
    Tips,
    useRNIAP,
} from '../screens';
import { width } from '../utilities/dimensions';
import { Blog, Lesson, SettingsState, SwingType, Tip } from '../__types__';
import { Pros } from '../screens/help/Pros';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';

export type RootStackParamList = {
    Register: undefined;
    Verify: { code: string };
    Settings: undefined;
    Lessons: undefined;
    SingleSetting: {
        setting: Exclude<keyof SettingsState, 'loading' | 'notifications'> | keyof SettingsState['notifications'];
    };
    Login: undefined;
    Record: {
        onReturn: () => void;
        swing: SwingType;
    };
    Lesson: { lesson: Lesson };
    SingleTip: { tip: Tip };
    SingleBlog: { blog: Blog };
    ResetPassword: undefined;
    Logs: undefined;
    About: undefined;
    FAQ: undefined;
    Home: undefined;
    Order: undefined;
    Pros: undefined;
    Submit: undefined;
    Blogs: undefined;
    Tips: undefined;
};

const Drawer = createDrawerNavigator();
const SettingsStack = createStackNavigator();
const AppStack = createStackNavigator();

const SettingsNavigator: React.FC = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        {/* @ts-ignore */}
        <SettingsStack.Screen name={ROUTES.SETTINGS} component={Settings} />
        {/* @ts-ignore */}
        <SettingsStack.Screen name={ROUTES.SETTING} component={SingleSetting} />
    </SettingsStack.Navigator>
);

const StackNavigator: React.FC = () => (
    <AppStack.Navigator initialRouteName={ROUTES.HOME} screenOptions={{ headerShown: false }}>
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.HOME} component={Home} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.LESSONS} component={Lessons} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.SUBMIT} component={Submit} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.RECORD} component={Record} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.ORDER} component={Order} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.BLOGS} component={Blogs} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.TIPS} component={Tips} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.LESSON} component={SingleLesson} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.TIP} component={SingleTip} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.BLOG} component={SingleBlog} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.ABOUT} component={About} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.FAQ} component={FAQ} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.PROS} component={Pros} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.LOGS} component={ErrorLogs} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsNavigator} />

        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.LOGIN} component={Login} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.REGISTER} component={Register} />
        {/* @ts-ignore */}
        <AppStack.Screen name={ROUTES.RESET_PASSWORD} component={ForgotPassword} />
    </AppStack.Navigator>
);
const MainNavigator: React.FC = () => {
    useRNIAP();
    return (
        <Drawer.Navigator
            initialRouteName={ROUTES.APP_GROUP}
            screenOptions={{
                drawerStyle: { width: width * 0.9 },
                headerShown: false,
                drawerType: 'slide',
            }}
            drawerContent={(props): JSX.Element => <NavigationDrawer {...props} />}
        >
            <Drawer.Screen
                name={ROUTES.APP_GROUP}
                component={StackNavigator}
                options={({ route }) => ({
                    swipeEnabled: ![ROUTES.LOGIN, ROUTES.RESET_PASSWORD, ROUTES.REGISTER].includes(
                        getFocusedRouteNameFromRoute(route) || ''
                    ),
                })}
            />
        </Drawer.Navigator>
    );
};
export default MainNavigator;
