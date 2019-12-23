import React, { useEffect } from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Components
import { StatusBar } from 'react-native';
import { ThemeProvider } from '@pxblue/react-native-components';
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

// Styles
import { white, purple, red } from './src/styles/colors';

// TODO: Organize all imports
// TODO: Clean up application storage after recording/picking videos : https://github.com/itinance/react-native-fs
// TODO: Check camera roll video size using RNFetchBlob
// TODO: Update production API with new handlers for user settings
// TODO: Update prod api with joined date
// TODO: Update production API with FAQ implementation
// TODO: Update prod API with lesson types
// TODO: Optimize components and library usage
// TODO: Optimize image assets and bundle size
// TODO: Fix all alignments (sizes using units)
// TODO: Catch blocks around all awaits

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
                <ThemeProvider
                    theme={{
                        roundness: 8,
                        fonts: {
                            extraBold: {
                                fontFamily: 'SFCompactDisplay-Black',
                                // fontWeight: '800'
                            },
                            bold: {
                                fontFamily: 'SFCompactDisplay-Bold',
                                // fontWeight: '700'
                            },
                            semiBold: {
                                fontFamily: 'SFCompactDisplay-Semibold',
                                // fontWeight: '600'
                            },
                            regular: {
                                fontFamily: 'SFCompactDisplay-Regular',
                                // fontWeight: '400'
                            },
                            light: {
                                fontFamily: 'SFCompactDisplay-Thin',
                                // fontWeight: '300'
                            },
                        },
                        colors: {
                            primary: purple[400],
                            background: white[400],
                            surface: white[50],
                            accent: purple[400],
                            error: red.A100,
                            text: purple[500],
                            onPrimary: white[50],
                        },
                        sizes: {
                            tiny: 10,
                            extraSmall: 12,
                            small: 14,
                            medium: 16,
                            large: 20,
                            extraLarge: 24,
                            giant: 34,
                        },
                    }}>
                    <RNIAPCallbacks />
                    <MainNavigator enableURLHandling={false} />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    );
};
