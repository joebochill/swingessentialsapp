import React, { useEffect } from 'react';

// Components
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-paper';
import MainNavigator from './src/navigation/MainNavigator';
import { RNIAPCallbacks } from './src/screens/lessons';
import SplashScreen from 'react-native-splash-screen';

// Redux
import { Provider } from 'react-redux';
import { loadInitialData } from './src/redux/actions';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/styles/theme';

// Redux
import { store } from './src/redux/store';

export const App = () => {
    useEffect(() => {
        SplashScreen.hide();
        StatusBar.setBarStyle('light-content', true);
        store.dispatch(loadInitialData());
    }, []);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ThemeProvider theme={theme}>
                    <RNIAPCallbacks />
                    <MainNavigator enableURLHandling={false} />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    );
};
