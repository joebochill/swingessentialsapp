import React, { useEffect } from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Components
import { StatusBar } from 'react-native';
import { ThemeProvider } from './src/styles/theme';
import MainNavigator from './src/navigation/MainNavigator';
import { RNIAPCallbacks } from './src/screens/lessons';
import SplashScreen from 'react-native-splash-screen';

// Redux
import { Provider } from 'react-redux';
import { AppReducer } from './src/redux/reducers';
import { saveAuthToken } from './src/api/tokenMiddleware';
import { loadInitialData } from './src/redux/actions';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Redux
export const store = createStore(AppReducer, applyMiddleware(thunk, saveAuthToken));


export const App = () => {
    useEffect(() => {
        SplashScreen.hide();
        StatusBar.setBarStyle('light-content', true);
        store.dispatch(loadInitialData());
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
