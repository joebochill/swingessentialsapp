import React from 'react';
import { View, Text } from 'react-native';
// React-Navigation Components
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Constants
import { ROUTES } from '../constants/routes';

// Route Components
// import { NavigationDrawer } from './NavigationDrawer';
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

// const Home: React.FC = () => <View>
//     <Text>Hello World</Text>
// </View>

export type RootStackParamList = {
    Register: { code: string };
    Verify: { code: string };
    Settings: undefined;
    SingleSetting: { setting: keyof SettingsState };
    Login: undefined;
    Record: {
        onReturn: () => void;
        swing: SwingType;
    };
    Lesson: { lesson: Lesson };
    SingleTip: { tip: Tip };
    SingleBlog: { blog: Blog };
};

// const AuthStack = createStackNavigator(
//     {
//         [ROUTES.LOGIN]: Login,
//         [ROUTES.REGISTER]: Register,
//         [ROUTES.RESET_PASSWORD]: ForgotPassword,
//     },
//     { initialRouteName: ROUTES.LOGIN, headerMode: 'none' },
// );
const SettingsStack = createStackNavigator();
const SubmitStack = createStackNavigator();
//     {
//         [ROUTES.SETTINGS]: Settings,
//         [ROUTES.SETTING]: SingleSetting,
//     },
//     { initialRouteName: ROUTES.SETTINGS, headerMode: 'none' },
// );

const AppStack = createStackNavigator();
//     {
//         [ROUTES.HOME]: Home,
//         [ROUTES.LESSONS]: Lessons,
//         [ROUTES.SUBMIT_GROUP]: {
//             screen: createStackNavigator(
//                 {
//                     [ROUTES.SUBMIT]: Submit,
//                     [ROUTES.RECORD]: Record,
//                 },
//                 { initialRouteName: ROUTES.SUBMIT, headerMode: 'none' },
//             ),
//         },
//         [ROUTES.ORDER]: Order,
//         [ROUTES.BLOGS]: Blogs,
//         [ROUTES.TIPS]: Tips,
//         [ROUTES.RECORD]: Record,

//         [ROUTES.LESSON]: SingleLesson,
//         [ROUTES.TIP]: SingleTip,
//         [ROUTES.BLOG]: SingleBlog,

//         [ROUTES.ABOUT]: About,
//         [ROUTES.FAQ]: FAQ,
//         // [ROUTES.CONTACT]: Contact,

//         // [ROUTES.ACCOUNT_DETAILS]: AccountDetails,
//         [ROUTES.LOGS]: ErrorLogs,
//         // [ROUTES.HISTORY]: OrderHistory,
//         [ROUTES.SETTINGS_GROUP]: SettingsStack,

//         // [ROUTES.AUTH_GROUP]: AuthStack,
//         [ROUTES.LOGIN]: Login,
//         [ROUTES.REGISTER]: Register,
//         [ROUTES.RESET_PASSWORD]: ForgotPassword,
//     },
//     {
//         initialRouteName: ROUTES.HOME,
//         headerMode: 'none',
//     },
// );

const SettingsNavigator: React.FC = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen name={ROUTES.SETTINGS} component={Settings} />
        <SettingsStack.Screen name={ROUTES.SETTING} component={SingleSetting} />
    </SettingsStack.Navigator>
);

const MainNavigator: React.FC = () => (
    <NavigationContainer>
        <AppStack.Navigator initialRouteName={ROUTES.HOME} screenOptions={{ headerShown: false }}>
            <AppStack.Screen name={ROUTES.HOME} component={Home} />
            <AppStack.Screen name={ROUTES.LESSONS} component={Lessons} />
            {/* <SubmitStack.Navigator initialRouteName={ROUTES.SUBMIT} screenOptions={{headerShown: false}}>
                <SubmitStack.Screen name={ROUTES.SUBMIT} component={Submit}/>
                <SubmitStack.Screen name={ROUTES.RECORD} component={Record}/>
            </SubmitStack.Navigator> */}
            <AppStack.Screen name={ROUTES.SUBMIT} component={Submit} />
            <AppStack.Screen name={ROUTES.RECORD} component={Record} />

            <AppStack.Screen name={ROUTES.ORDER} component={Order} />
            <AppStack.Screen name={ROUTES.BLOGS} component={Blogs} />
            <AppStack.Screen name={ROUTES.TIPS} component={Tips} />
            {/* <AppStack.Screen name={ROUTES.RECORD} component={Record} /> */}

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
    </NavigationContainer>
);
export default MainNavigator;
// export default createAppContainer(
//     createDrawerNavigator(
//         {
//             [ROUTES.APP_GROUP]: AppStack,
//         },
//         {
//             initialRouteName: ROUTES.APP_GROUP,
//             drawerWidth: width * 0.9,
//             contentComponent: NavigationDrawer,
//         },
//     ),
// );
