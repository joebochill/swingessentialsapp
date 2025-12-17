import { Stack } from 'expo-router';

import React, { useEffect } from 'react';

// Redux
import { Provider } from 'react-redux';

// Utilities
import { TokenModal } from '@/components/auth/TokenModal';
import { ConnectivityModal } from '@/components/feedback/ConnectivityModal';
import { store } from '@/redux/store';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useFonts } from 'expo-font';
import { useIAP } from 'expo-iap';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useIAP();

    const [fontsLoaded] = useFonts({
        'SFCompactDisplay-Black': require('../assets/fonts/SFCompactDisplay-Black.otf'),
        'SFCompactDisplay-Bold': require('../assets/fonts/SFCompactDisplay-Bold.otf'),
        'SFCompactDisplay-Regular': require('../assets/fonts/SFCompactDisplay-Regular.otf'),
        'SFCompactDisplay-Semibold': require('../assets/fonts/SFCompactDisplay-Semibold.otf'),
        'SFCompactDisplay-Thin': require('../assets/fonts/SFCompactDisplay-Thin.otf'),
    });

    useEffect(() => {
        async function prepare() {
            if (fontsLoaded) {
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, [fontsLoaded]);

    return (
        <Provider store={store}>
            <GestureHandlerRootView>
                <SafeAreaProvider>
                    <ThemeProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(drawer)" />
                        </Stack>
                        <StatusBar style="auto" />
                        <TokenModal />
                        <ConnectivityModal />
                    </ThemeProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </Provider>
    );
}
