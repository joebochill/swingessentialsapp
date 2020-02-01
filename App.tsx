import React, { useEffect } from 'react';

// Components
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { ThemeProvider } from './src/styles/theme';
import MainNavigator from './src/navigation/MainNavigator';
import { RNIAPCallbacks } from './src/screens/lessons';
import SplashScreen from 'react-native-splash-screen';

// Redux
import { Provider } from 'react-redux';
import { loadInitialData } from './src/redux/actions';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Logger } from './src/utilities/logging';

// Redux
import { store } from './src/redux/store';

export const App = () => {
    useEffect(() => {
        SplashScreen.hide();
        StatusBar.setBarStyle('light-content', true);
        store.dispatch(loadInitialData());
        // const requestPermissions = async () => {
        //     if (Platform.OS === 'android') {
        //         try {
        //             const cameragranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        //             const audiogranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        //             const readrollranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        //             const writerollgranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        //         } catch (err) {
        //             Logger.logError({
        //                 code: 'APP100',
        //                 description: `Failed to request permissions.`,
        //                 rawErrorCode: err.code,
        //                 rawErrorMessage: err.message,
        //             });
        //         }
        //     }
        // };
        // requestPermissions();
    }, []);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <RNIAPCallbacks />
                    <MainNavigator enableURLHandling={false} />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    );
};
