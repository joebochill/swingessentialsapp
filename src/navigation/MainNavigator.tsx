// import React from 'react';
// import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
// import { Transition } from 'react-native-reanimated';

// React-Navigation Components
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

// Constants
import { ROUTES } from '../constants/routes';

// Route Components
import { NavigationDrawer } from './NavigationDrawer';
import { 
    AuthLoading, Login, Register, ForgotPassword, 
    About, FAQ, Contact,
    Settings, SingleSetting, 
    AccountDetails, OrderHistory, ErrorLogs, 
    Home, 
    Lessons, SingleLesson, Order, Submit, Record, 
    Blogs, SingleBlog, Tips, SingleTip 
} from './screens';

const AuthStack = createStackNavigator(
    {
        [ROUTES.LOGIN]: Login,
        [ROUTES.REGISTER]: Register,
        [ROUTES.RESET_PASSWORD]: ForgotPassword,
    },
    { initialRouteName: ROUTES.LOGIN, headerMode: 'none' },
);
const AppStack = createDrawerNavigator(
    {
        [ROUTES.HOME_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.HOME]: Home,
                    [ROUTES.AUTH_GROUP]: AuthStack,
                },
                { initialRouteName: ROUTES.HOME, headerMode: 'none' },
            ),
        },
        [ROUTES.LESSONS_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.LESSONS]: Lessons,
                    [ROUTES.LESSON]: SingleLesson,
                    [ROUTES.AUTH_GROUP]: AuthStack,
                },
                { initialRouteName: ROUTES.LESSONS, headerMode: 'none' },
            ),
        },
        [ROUTES.ORDER]: {
            screen: Order,
            
        },
        [ROUTES.ABOUT]: {
            screen: About
        },
        [ROUTES.FAQ]: {
            screen: FAQ
        },
        [ROUTES.CONTACT]: {
            screen: Contact
        },
        [ROUTES.ACCOUNT_DETAILS]: {
            screen: AccountDetails
        },
        [ROUTES.LOGS]: {
            screen: ErrorLogs
        },
        [ROUTES.HISTORY]: {
            screen: OrderHistory
        },
        [ROUTES.SUBMIT_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.SUBMIT]: Submit,
                    [ROUTES.RECORD]: Record
                },
                { initialRouteName: ROUTES.SUBMIT, headerMode: 'none' },
            ),
        },
        [ROUTES.BLOGS_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.BLOGS]: Blogs,
                    [ROUTES.BLOG]: SingleBlog
                },
                { initialRouteName: ROUTES.BLOGS, headerMode: 'none' },
            ),
        },
        [ROUTES.TIPS_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.TIPS]: Tips,
                    [ROUTES.TIP]: SingleTip
                },
                { initialRouteName: ROUTES.TIPS, headerMode: 'none' },
            ),
        },
        [ROUTES.SETTINGS_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.SETTINGS]: Settings,
                    [ROUTES.SETTING]: SingleSetting
                },
                { initialRouteName: ROUTES.SETTINGS, headerMode: 'none' },
            ),
        }
    },
    {
        initialRouteName: ROUTES.HOME_GROUP,
        drawerWidth: 350, //TODO: scale
        contentComponent: NavigationDrawer,
    },
);



export default createAppContainer(
    // createAnimatedSwitchNavigator(
    createSwitchNavigator(
        {
            // [ROUTES.AUTH_LOADING]: AuthLoading,
            [ROUTES.APP_GROUP]: AppStack,
            // [ROUTES.AUTH_GROUP]: AuthStack,
        },
        {
            initialRouteName: ROUTES.APP_GROUP,
            // transition: (
            //     <Transition.Together>
            //       <Transition.Out
            //         type="slide-bottom"
            //         durationMs={250}
            //         interpolation="easeIn"
            //       />
            //       <Transition.In type="fade" durationMs={250} />
            //     </Transition.Together>
            //   ),
        },
    ),
);
