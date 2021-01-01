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

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            // primary: string;
            // background: string;
            // surface: string;
            // accent: string;
            // error: string;
            // text: string;
            // placeholder: string;
            onPrimary: string;
            dark: string;
            light: string;
        }
        // interface ThemeFont {
        //     fontWeight: 'normal'
        //     | 'bold'
        //     | '100'
        //     | '200'
        //     | '300'
        //     | '400'
        //     | '500'
        //     | '600'
        //     | '700'
        //     | '800'
        //     | '900';
        // }
        interface ThemeFonts {
            semiBold: ReactNativePaper.ThemeFont;
        }

        interface Theme {
            sizes: {
                xSmall: number;
                small: number;
                medium: number;
                large: number;
                xLarge: number;
                jumbo: number;
            };
            spaces: {
                xSmall: number;
                small: number;
                medium: number;
                large: number;
                xLarge: number;
                jumbo: number;
            };
            fontSizes: {
                10: number;
                12: number;
                14: number;
                16: number;
                18: number;
                20: number;
                24: number;
                34: number;
                48: number;
                60: number;
                96: number;
            };
        }
    }
}

export const App: React.FC = () => {
    useEffect((): void => {
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
