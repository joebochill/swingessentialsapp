/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { App } from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            onPrimary: string;
            dark: string;
            light: string;
        }

        interface Theme {
            sizes: {
                xSmall: number;
                small: number;
                medium: number;
                large: number;
                xLarge: number;
                jumbo: number;
            },
            spaces: {
                xSmall: number;
                small: number;
                medium: number;
                large: number;
                xLarge: number;
                jumbo: number;
            },
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
            }
        }
    }
}

AppRegistry.registerComponent(appName, () => App);
