import React, { useEffect } from 'react';

// Components
import { StatusBar /*useColorScheme*/ } from 'react-native';

// import { RNIAPCallbacks } from './src/screens/lessons';
// import SplashScreen from 'react-native-splash-screen';
import BootSplash from "react-native-bootsplash";
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';

// Redux
import { Provider } from 'react-redux';
import { loadInitialData } from './src/redux/actions';
import { store } from './src/redux/store';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { SETheme } from './src/theme';

// TODO: Support dark mode
export default function App(): React.JSX.Element {
    const { hasPermission: hasVideoPermission, requestPermission: requestVideoPermission } = useCameraPermission();
    const { hasPermission: hasMicrophonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();

    // useEffect((): void => {
    //     // SplashScreen.hide();
    //     StatusBar.setBarStyle('light-content', true);
    //     // @ts-ignore
    //     store.dispatch(loadInitialData());
    //     if(!hasVideoPermission) requestVideoPermission();
    //     if(!hasMicrophonePermission) requestMicrophonePermission();
    // }, []);
    useEffect(() => {
        // const init = async () => {
        //     // …do multiple sync or async tasks
        // };

        // init().finally(async () => {
        //     await BootSplash.hide({ fade: true });
        //     console.log("BootSplash has been hidden successfully");
        // });
    }, []);
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer
                    onReady={() => {
                        BootSplash.hide({fade: true});
                    }}>
                    <PaperProvider theme={SETheme}>
                        {/* <RNIAPCallbacks /> */}
                        <MainNavigator /* enableURLHandling={false}*/ />
                    </PaperProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}
