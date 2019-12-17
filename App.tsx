import React from 'react';
import { ThemeProvider } from '@pxblue/react-native-components';
import MainNavigator from './src/navigation/MainNavigator';
import { RNIAPCallbacks } from './src/navigation/screens/lessons';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { AppReducer } from './src/redux/reducers';
import { saveAuthToken } from './src/api/tokenMiddleware';
import { loadInitialData } from './src/redux/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { white, purple, red } from './src/styles';

// TODO: Organize all imports
// TODO: Clean up application storage after recording/picking videos : https://github.com/itinance/react-native-fs
// TODO: Check camera roll video size using RNFetchBlob
// TODO: Update production API with new handlers for user settings
// TODO: Update production API with FAQ implementation
// TODO: Update prod API with lesson types

const store = createStore(AppReducer, applyMiddleware(thunk, saveAuthToken));

export const App = () => {
    store.dispatch(loadInitialData());
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
