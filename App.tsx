import React from 'react';
import { ThemeProvider } from '@pxblue/react-native-components';
import MainNavigator from './src/navigation/MainNavigator';

export const App = () => {
    return (
        <ThemeProvider>
            <MainNavigator />
        </ThemeProvider>
    );
};
