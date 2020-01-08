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
    // AccountDetails,
    Blogs,
    // Contact,
    ErrorLogs,
    FAQ,
    ForgotPassword,
    Home,
    Lessons,
    Login,
    Order,
    // OrderHistory,
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
        // [ROUTES.CONTACT]: Contact,

        // [ROUTES.ACCOUNT_DETAILS]: AccountDetails,
        [ROUTES.LOGS]: ErrorLogs,
        // [ROUTES.HISTORY]: OrderHistory,
        [ROUTES.SETTINGS_GROUP]: SettingsStack,

        [ROUTES.AUTH_GROUP]: AuthStack,
    },
    {
        initialRouteName: ROUTES.HOME,
        headerMode: 'none',
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
