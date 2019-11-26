import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { NavigationDrawer } from './NavigationDrawer';
// import { NavTest as NavigationDrawer } from './NavTest';
// Import the different pages for the application
import { ROUTES } from '../constants/routes';
import { About, Settings, SingleSetting, AccountDetails, OrderHistory, ErrorLogs, FAQ, Contact, Home, Lessons, SingleLesson, Order, Submit, Record, Blogs, SingleBlog, Tips, SingleTip } from './screens';

const AppStack = createDrawerNavigator(
    {
        [ROUTES.HOME_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.HOME]: Home,
                },
                { initialRouteName: ROUTES.HOME, headerMode: 'none' },
            ),
        },
        [ROUTES.LESSONS_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.LESSONS]: Lessons,
                    [ROUTES.LESSON]: SingleLesson,
                },
                { initialRouteName: ROUTES.LESSONS, headerMode: 'none' },
            ),
        },
        [ROUTES.ORDER]:{
            screen: Order
        },
        [ROUTES.ABOUT]:{
            screen: About
        },
        [ROUTES.FAQ]:{
            screen: FAQ
        },
        [ROUTES.CONTACT]:{
            screen: Contact
        },
        [ROUTES.ACCOUNT_DETAILS]:{
            screen: AccountDetails
        },
        [ROUTES.LOGS]:{
            screen: ErrorLogs
        },
        [ROUTES.HISTORY]:{
            screen: OrderHistory
        },
        [ROUTES.SUBMIT_GROUP]:{
            screen: createStackNavigator(
                {
                    [ROUTES.SUBMIT]: Submit,
                    [ROUTES.RECORD]: Record
                },
                { initialRouteName: ROUTES.SUBMIT, headerMode: 'none' },
            ),
        },
        [ROUTES.BLOGS_GROUP]:{
            screen: createStackNavigator(
                {
                    [ROUTES.BLOGS]: Blogs,
                    [ROUTES.BLOG]: SingleBlog
                },
                { initialRouteName: ROUTES.BLOGS, headerMode: 'none' },
            ),
        },
        [ROUTES.TIPS_GROUP]:{
            screen: createStackNavigator(
                {
                    [ROUTES.TIPS]: Tips,
                    [ROUTES.TIP]: SingleTip
                },
                { initialRouteName: ROUTES.TIPS, headerMode: 'none' },
            ),
        },
        [ROUTES.SETTINGS_GROUP]:{
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
    createSwitchNavigator(
        {
            [ROUTES.APP_GROUP]: AppStack,
        },
        {
            initialRouteName: ROUTES.APP_GROUP,
        },
    ),
);
