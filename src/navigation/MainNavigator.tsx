import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { NavigationDrawer } from './NavigationDrawer';

// Import the different pages for the application
import { ROUTES } from '../constants/routes';
import { Home, Lessons, SingleLesson } from './screens';

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
