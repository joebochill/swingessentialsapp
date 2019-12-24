// React-Navigation Components
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

// Constants
import { ROUTES } from '../constants/routes';

// Route Components
import { NavigationDrawer } from './NavigationDrawer';
import {
    About,
    AccountDetails,
    Blogs,
    Contact,
    ErrorLogs,
    FAQ,
    ForgotPassword,
    Home,
    Lessons,
    Login,
    Order,
    OrderHistory,
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

const AuthStack = createStackNavigator(
    {
        [ROUTES.LOGIN]: Login,
        [ROUTES.REGISTER]: Register,
        [ROUTES.RESET_PASSWORD]: ForgotPassword,
    },
    { initialRouteName: ROUTES.LOGIN, headerMode: 'none' },
);
const SettingsStack = createStackNavigator(
    {
        [ROUTES.SETTINGS]: Settings,
        [ROUTES.SETTING]: SingleSetting,
    },
    { initialRouteName: ROUTES.SETTINGS, headerMode: 'none' },
);
// const AppStack = createDrawerNavigator(
//     {
//         [ROUTES.HOME_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.HOME]: Home,
//                     [ROUTES.LESSON]: SingleLesson,
//                     [ROUTES.TIP]: SingleTip,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.HOME, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.LESSONS_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.LESSONS]: Lessons,
//                     [ROUTES.LESSON]: SingleLesson,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.LESSONS, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.ORDER_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.ORDER]: Order,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.ORDER, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.ABOUT_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.ABOUT]: About,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.ABOUT, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.FAQ_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.FAQ]: FAQ,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.FAQ, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.CONTACT]: {
//             screen: Contact,
//         },
//         [ROUTES.ACCOUNT_DETAILS]: {
//             screen: AccountDetails,
//         },
//         [ROUTES.LOGS]: {
//             screen: ErrorLogs,
//         },
//         [ROUTES.HISTORY]: {
//             screen: OrderHistory,
//         },
//         [ROUTES.SUBMIT_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.SUBMIT]: Submit,
//                     [ROUTES.RECORD]: Record,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                     [ROUTES.SETTINGS_GROUP]: SettingsStack,
//                 },
//                 { initialRouteName: ROUTES.SUBMIT, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.BLOGS_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.BLOGS]: Blogs,
//                     [ROUTES.BLOG]: SingleBlog,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.BLOGS, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.TIPS_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.TIPS]: Tips,
//                     [ROUTES.TIP]: SingleTip,
//                     [ROUTES.AUTH_GROUP]: AuthStack,
//                 },
//                 { initialRouteName: ROUTES.TIPS, headerMode: 'none' },
//             ),
//         },
//     },
//     {
//         initialRouteName: ROUTES.HOME_GROUP,
//         drawerWidth: width * 0.9,
//         contentComponent: NavigationDrawer,
//     },
// );

const AppStack = createStackNavigator(
    {
        [ROUTES.HOME]: Home,
        [ROUTES.LESSONS]: Lessons,
        [ROUTES.SUBMIT_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.SUBMIT]: Submit,
                    [ROUTES.RECORD]: Record,
                },
                { initialRouteName: ROUTES.SUBMIT, headerMode: 'none' },
            ),
        },
        [ROUTES.ORDER]: Order,
        [ROUTES.BLOGS]: Blogs,
        [ROUTES.TIPS]: Tips,
        [ROUTES.RECORD]: Record,

        [ROUTES.LESSON]: SingleLesson,
        [ROUTES.TIP]: SingleTip,
        [ROUTES.BLOG]: SingleBlog,

        [ROUTES.ABOUT]: About,
        [ROUTES.FAQ]: FAQ,
        [ROUTES.CONTACT]: Contact,

        [ROUTES.ACCOUNT_DETAILS]: AccountDetails,
        [ROUTES.LOGS]: ErrorLogs,
        [ROUTES.HISTORY]: OrderHistory,
        [ROUTES.SETTINGS_GROUP]: SettingsStack,

        [ROUTES.AUTH_GROUP]: AuthStack,        
    },
    {
        initialRouteName: ROUTES.HOME,
        headerMode: 'none'
    },
);

export default createAppContainer(
    createDrawerNavigator(
        {
            [ROUTES.APP_GROUP]: AppStack,
        },
        {
            initialRouteName: ROUTES.APP_GROUP,
            drawerWidth: width * 0.9,
            contentComponent: NavigationDrawer,
        },
    ),
);
