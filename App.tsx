import React from 'react';
import { ThemeProvider } from '@pxblue/react-native-components';
import MainNavigator from './src/navigation/MainNavigator';

export const App = () => {
    return (
        <ThemeProvider theme={{
            roundness: 3,
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
                }
            },
            colors: {
                primary: '#231F61',
                background: '#F2F2F2',
                surface: '#FFFFFF',
                accent: '#4F4C81',
                error: '#FF3333',
                text: '#231F61',
                onPrimary: '#FFFFFF'
            },
            sizes: {
                tiny: 10,
                extraSmall: 12,
                small: 14,
                medium: 16,
                large: 20,
                extraLarge: 24,
                giant: 34
            }
        }}>
            <MainNavigator />
        </ThemeProvider>
    );
};
