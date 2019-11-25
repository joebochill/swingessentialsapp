import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import NavigationDrawer from './NavigationDrawer';

// Import the different pages for the application
import { ROUTES } from '../constants/routes';

// import ForgotScreen from './screens/authentication/Forgot';
// import LoginScreen from './screens/authentication/Login';
// import RegisterScreen from './screens/authentication/Register';
// import AboutScreen from './screens/help/About';
// import HelpScreen from './screens/help/Help';
import LessonsScreen from './screens/lessons/Lessons';
import LessonScreen from './screens/lessons/SingleLesson';
// import OrderScreen from './screens/lessons/Order';
// import RecordScreen from './screens/lessons/Record';
// import RedeemScreen from './screens/lessons/Redeem';

// import BlogsScreen from './screens/posts/Blogs';
// import BlogScreen from './screens/posts/SingleBlog';
// import TipsScreen from './screens/posts/Tips';
// import TipScreen from './screens/posts/SingleTip';

// import LogsScreen from './screens/settings/Logs';
// import SettingsScreen from './screens/settings/Settings';
// import SettingScreen from './screens/settings/SingleSetting';

const AppStack = createDrawerNavigator(
    {
        [ROUTES.MAIN_GROUP]: {
            screen: createStackNavigator(
                {
                    [ROUTES.LESSONS]: LessonsScreen,
                    [ROUTES.LESSON]: LessonScreen,
                },
                { initialRouteName: ROUTES.LESSONS, headerMode: 'none' },
            ),
        },
    },
    {
        initialRouteName: ROUTES.MAIN_GROUP,
        drawerWidth: 280, //TODO: scale
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
