import React, { useEffect } from 'react';

// Components
import { StatusBar /*useColorScheme*/ } from 'react-native';

// import { RNIAPCallbacks } from './src/screens/lessons';
// import SplashScreen from 'react-native-splash-screen';

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
import { SETheme } from './src/styles/theme';

// TODO: Support dark mode
export default function App(): React.JSX.Element {
    useEffect((): void => {
        // SplashScreen.hide();
        StatusBar.setBarStyle('light-content', true);
        // @ts-ignore
        store.dispatch(loadInitialData());
    }, []);
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <PaperProvider theme={SETheme}>
                        {/* <RNIAPCallbacks /> */}
                        <MainNavigator /* enableURLHandling={false}*/ />
                    </PaperProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}
