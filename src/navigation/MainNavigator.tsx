import React from 'react';
// React-Navigation Components
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Constants
// import { ROUTES } from '../constants/routes';
// import { Home } from '../screens/Home';
import { RootStackParamList } from './navigation.types';
import { HomeScreen } from '../screens/Home';
// import { ProfileScreen } from '../screens/Profile';

// Route Components
// import { NavigationDrawer } from './NavigationDrawer';
// import {
//     About,
//     Blogs,
//     ErrorLogs,
//     FAQ,
//     ForgotPassword,
//     Home,
//     Lessons,
//     Login,
//     Order,
//     Record,
//     Register,
//     Settings,
//     SingleBlog,
//     SingleLesson,
//     SingleSetting,
//     SingleTip,
//     Submit,
//     Tips,
// } from '../screens';
// import { width } from '../utilities/dimensions';
// import { Blog, Lesson, SettingsState, SwingType, Tip } from '../__types__';
// import { Pros } from '../screens/help/Pros';



const Drawer = createDrawerNavigator();
// const SettingsStack = createStackNavigator();
const AppStack = createStackNavigator<RootStackParamList>();

// const SettingsNavigator: React.FC = () => (
//     <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
//         <SettingsStack.Screen name={ROUTES.SETTINGS} component={Settings} />
//         <SettingsStack.Screen name={ROUTES.SETTING} component={SingleSetting} />
//     </SettingsStack.Navigator>
// );

const StackNavigator: React.FC = () => (
    <AppStack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
        {/* <AppStack.Screen name="Home" component={Home} /> */}
        <AppStack.Screen
            name={'Home'}
            component={HomeScreen}
        />
        {/* <AppStack.Screen name="Feed" component={Feed} /> */}


        {/* <AppStack.Screen name={ROUTES.HOME} component={Home} /> */}
        {/* <AppStack.Screen name={ROUTES.LESSONS} component={Lessons} />

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
        <AppStack.Screen name={ROUTES.PROS} component={Pros} />

        <AppStack.Screen name={ROUTES.LOGS} component={ErrorLogs} />

        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsNavigator} />

        <AppStack.Screen name={ROUTES.LOGIN} component={Login} />
        <AppStack.Screen name={ROUTES.REGISTER} component={Register} />
        <AppStack.Screen name={ROUTES.RESET_PASSWORD} component={ForgotPassword} /> */}
    </AppStack.Navigator>
);
const MainNavigator: React.FC = () => (
    <Drawer.Navigator
        initialRouteName={'APP_GROUP'}
        screenOptions={{
            // drawerStyle: { width: width * 0.9 },
            headerShown: false,
        }}
    // drawerContent={(props): JSX.Element => <NavigationDrawer {...props} />}
    >
        <Drawer.Screen name={'APP_GROUP'} component={StackNavigator} />
    </Drawer.Navigator>
);
export default MainNavigator;
