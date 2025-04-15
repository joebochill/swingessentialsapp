import React, { useEffect } from 'react';

import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

// Redux
import { Provider } from 'react-redux';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withIAPContext } from 'react-native-iap';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainNavigation } from './src/navigation/MainNavigation';
import { store } from './src/redux/store';
import { initializeData } from './src/redux/thunks';
import { ThemeProvider } from './src/theme/ThemeProvider';

function App(): React.JSX.Element {
    const { hasPermission: hasVideoPermission, requestPermission: requestVideoPermission } = useCameraPermission();
    const { hasPermission: hasMicrophonePermission, requestPermission: requestMicrophonePermission } =
        useMicrophonePermission();

    // Initialize redux store data
    useEffect(() => {
        void store.dispatch(initializeData());
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
            <GestureHandlerRootView>
                <SafeAreaProvider>
                    <ThemeProvider>
                        <MainNavigation />
                    </ThemeProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </Provider>
    );
}

export default withIAPContext(App);
