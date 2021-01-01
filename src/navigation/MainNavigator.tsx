import React from 'react';
// React-Navigation Components
import { NavigationContainer } from '@react-navigation/native';
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
} from '../screens';
import { width } from '../utilities/dimensions';
import { Blog, Lesson, SettingsState, SwingType, Tip } from '../__types__';

export type RootStackParamList = {
    Register: undefined;
    Verify: { code: string };
    Settings: undefined;
    Lessons: undefined;
    SingleSetting: { setting: keyof SettingsState };
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
    Submit: undefined;
    Blogs: undefined;
    Tips: undefined;
};

const Drawer = createDrawerNavigator();
const SettingsStack = createStackNavigator();
const AppStack = createStackNavigator();

const SettingsNavigator: React.FC = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen name={ROUTES.SETTINGS} component={Settings} />
        <SettingsStack.Screen name={ROUTES.SETTING} component={SingleSetting} />
    </SettingsStack.Navigator>
);

const StackNavigator: React.FC = () => (
    <AppStack.Navigator initialRouteName={ROUTES.HOME} screenOptions={{ headerShown: false }}>
        <AppStack.Screen name={ROUTES.HOME} component={Home} />
        <AppStack.Screen name={ROUTES.LESSONS} component={Lessons} />

        <AppStack.Screen name={ROUTES.SUBMIT} component={Submit} />
        <AppStack.Screen name={ROUTES.RECORD} component={Record} />

        <AppStack.Screen name={ROUTES.ORDER} component={Order} />
        <AppStack.Screen name={ROUTES.BLOGS} component={Blogs} />
        <AppStack.Screen name={ROUTES.TIPS} component={Tips} />

        <AppStack.Screen name={ROUTES.LESSON} component={SingleLesson} />
        <AppStack.Screen name={ROUTES.TIP} component={SingleTip} />
        <AppStack.Screen name={ROUTES.BLOG} component={SingleBlog} />

        <AppStack.Screen name={ROUTES.ABOUT} component={About} />
        <AppStack.Screen name={ROUTES.FAQ} component={FAQ} />

        <AppStack.Screen name={ROUTES.LOGS} component={ErrorLogs} />

        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsNavigator} />

        <AppStack.Screen name={ROUTES.LOGIN} component={Login} />
        <AppStack.Screen name={ROUTES.REGISTER} component={Register} />
        <AppStack.Screen name={ROUTES.RESET_PASSWORD} component={ForgotPassword} />
    </AppStack.Navigator>
);
const MainNavigator: React.FC = () => (
    <NavigationContainer>
        <Drawer.Navigator
            initialRouteName={ROUTES.APP_GROUP}
            drawerStyle={{ width: width * 0.9 }}
            drawerContent={(props): JSX.Element => <NavigationDrawer {...props} />}
        >
            <Drawer.Screen name={ROUTES.APP_GROUP} component={StackNavigator} />
        </Drawer.Navigator>
    </NavigationContainer>
);
export default MainNavigator;
