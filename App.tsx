import React, { useEffect } from 'react';

import BootSplash from 'react-native-bootsplash';
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
import { withIAPContext } from 'react-native-iap';
import { useRNIAP } from './src/screens/lessons/RNIAPConfig';

// TODO: Support dark mode
function App(): React.JSX.Element {
    const { hasPermission: hasVideoPermission, requestPermission: requestVideoPermission } = useCameraPermission();
    const { hasPermission: hasMicrophonePermission, requestPermission: requestMicrophonePermission } =
        useMicrophonePermission();
    useRNIAP();

    // Initialize redux store data
    useEffect(() => {
        void store.dispatch(loadInitialData());
    }, []);

    // Check / request app permissions
    useEffect((): void => {
        const checkPermissions = async (): Promise<void> => {
            if (!hasVideoPermission) {
                const result = await requestVideoPermission();
                if (!result) {
                    // TODO: Tell them to give permission in settings
                }
            }
            if (!hasMicrophonePermission) {
                const result = await requestMicrophonePermission();
                if (!result) {
                    // TODO: Tell them to give permission in settings
                }
            }
        };
        void checkPermissions();
    }, [hasMicrophonePermission, hasVideoPermission, requestMicrophonePermission, requestVideoPermission]);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer
                    onReady={() => {
                        void BootSplash.hide({ fade: true });
                    }}
                >
                    <PaperProvider theme={SETheme}>
                        {/* <RNIAPCallbacks /> */}
                        <MainNavigator /* enableURLHandling={false}*/ />
                    </PaperProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}
export default withIAPContext(App);
