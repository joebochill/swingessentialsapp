import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { ROUTES } from '../constants/routes';
import { View, Text } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { width } from '../utilities/dimensions';
import { DrawerContent } from './DrawerContent';

const linkingConfig: LinkingOptions<RootDrawerParamList> = {
    prefixes: ['https://www.swingessentials.com'],
    config: {
        screens: {
            APP: {
                screens: {
                    [ROUTES.REGISTER]: 'register/:code?',
                    [ROUTES.LESSONS]: 'lessons',
                },
            },
        },
    },
};

// Placeholder components for each route
const PlaceholderScreen = ({ name }: { name: string }) => (
    <View>
        <Text>{`${name} Screen`}</Text>
    </View>
);

// Define types for Stack Navigator
export type RootStackParamList = {
    [ROUTES.LOGIN]: undefined;
    [ROUTES.REGISTER]: undefined;
    [ROUTES.RESET_PASSWORD]: undefined;

    [ROUTES.HOME]: undefined;

    [ROUTES.LESSONS]: undefined;
    [ROUTES.LESSON]: undefined;

    [ROUTES.SUBMIT]: undefined;
    [ROUTES.RECORD]: undefined;
    [ROUTES.ORDER]: undefined;

    [ROUTES.BLOGS]: undefined;
    [ROUTES.BLOG]: undefined;

    [ROUTES.TIPS]: undefined;
    [ROUTES.TIP]: undefined;

    [ROUTES.ABOUT]: undefined;
    [ROUTES.FAQ]: undefined;

    [ROUTES.PROS]: undefined;

    [ROUTES.LOGS]: undefined;

    [ROUTES.SETTINGS_GROUP]: undefined;
};
export type SettingsStackParamList = {
    [ROUTES.SETTINGS]: undefined;
    [ROUTES.SETTING]: undefined;
};

// Define types for Drawer Navigator
export type RootDrawerParamList = {
    APP: undefined;
};

// Navigators
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const AppStack = createStackNavigator<RootStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

const MainStackNavigator = () => (
    <AppStack.Navigator initialRouteName={ROUTES.HOME}>
        <AppStack.Screen
            name={ROUTES.LOGIN}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.LOGIN>) => (
                <PlaceholderScreen {...props} name={'Login'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.REGISTER}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.REGISTER>) => (
                <PlaceholderScreen {...props} name={'Register'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.RESET_PASSWORD}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.RESET_PASSWORD>) => (
                <PlaceholderScreen {...props} name={'Reset Password'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.HOME}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.HOME>) => (
                <PlaceholderScreen {...props} name={'Home'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.LESSONS}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.LESSONS>) => (
                <PlaceholderScreen {...props} name={'Lessons'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.LESSON}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.LESSON>) => (
                <PlaceholderScreen {...props} name={'Single Lesson'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.SUBMIT}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.SUBMIT>) => (
                <PlaceholderScreen {...props} name={'Submit'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.RECORD}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.RECORD>) => (
                <PlaceholderScreen {...props} name={'Record'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.ORDER}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.ORDER>) => (
                <PlaceholderScreen {...props} name={'Order'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.BLOGS}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.BLOGS>) => (
                <PlaceholderScreen {...props} name={'Blogs'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.BLOG}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.BLOG>) => (
                <PlaceholderScreen {...props} name={'Single Blog'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.TIPS}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.TIPS>) => (
                <PlaceholderScreen {...props} name={'Tips'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.TIP}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.TIP>) => (
                <PlaceholderScreen {...props} name={'Single Tip'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.ABOUT}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.ABOUT>) => (
                <PlaceholderScreen {...props} name={'About'} />
            )}
        />
        <AppStack.Screen
            name={ROUTES.FAQ}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.FAQ>) => (
                <PlaceholderScreen {...props} name={'FAQ'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.PROS}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.PROS>) => (
                <PlaceholderScreen {...props} name={'Pros'} />
            )}
        />

        <AppStack.Screen
            name={ROUTES.LOGS}
            component={(props: StackScreenProps<RootStackParamList, typeof ROUTES.LOGS>) => (
                <PlaceholderScreen {...props} name={'Logs'} />
            )}
        />

        <AppStack.Screen name={ROUTES.SETTINGS_GROUP} component={SettingsStackNavigator} />
    </AppStack.Navigator>
);

const SettingsStackNavigator = () => (
    <SettingsStack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen
            name={ROUTES.SETTINGS}
            component={(props: StackScreenProps<SettingsStackParamList, typeof ROUTES.SETTINGS>) => (
                <PlaceholderScreen {...props} name={'Settings'} />
            )}
        />
        <SettingsStack.Screen
            name={ROUTES.SETTING}
            component={(props: StackScreenProps<SettingsStackParamList, typeof ROUTES.SETTING>) => (
                <PlaceholderScreen {...props} name={'Single Setting'} />
            )}
        />
    </SettingsStack.Navigator>
);

export const MainNavigation = () => (
    <NavigationContainer
        onReady={() => {
            void BootSplash.hide({ fade: true });
        }}
        linking={linkingConfig}
    >
        <Drawer.Navigator
            initialRouteName={'APP'}
            screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                drawerStyle: {
                    width: width * 0.9,
                },
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen
                name="APP"
                component={MainStackNavigator}
                options={({ route }) => ({
                    swipeEnabled: ![ROUTES.LOGIN, ROUTES.RESET_PASSWORD, ROUTES.REGISTER].includes(
                        (getFocusedRouteNameFromRoute(route) as 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD') || ''
                    ),
                })}
            />
        </Drawer.Navigator>
    </NavigationContainer>
);
