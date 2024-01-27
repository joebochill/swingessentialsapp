import React, { useEffect } from 'react';

// Components
import { StatusBar, /*useColorScheme*/ } from 'react-native';

// import { RNIAPCallbacks } from './src/screens/lessons';
// import SplashScreen from 'react-native-splash-screen';

// Navigation 
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';

// Redux
import { Provider } from 'react-redux';
// import { loadInitialData } from './src/redux/actions';
import { store } from './src/redux/store';

// Utilities
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3Theme, configureFonts, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { fontConfig } from './typography/fontConfig';
import { loadLessons } from './src/redux/actions/lessons';
// import { theme } from './src/styles/theme';


const theme: MD3Theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig, isV3: true }),
};

// TODO: Support dark mode
export default function App(): React.JSX.Element {
  useEffect((): void => {
    // SplashScreen.hide();
    StatusBar.setBarStyle('light-content', true);
    // store.dispatch(loadInitialData());
    // store.dispatch(loadLessons());
  }, []);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <PaperProvider theme={theme}>
            {/* <RNIAPCallbacks /> */}
            <MainNavigator /* enableURLHandling={false}*/ />
          </PaperProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}