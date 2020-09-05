import { DefaultTheme, configureFonts } from 'react-native-paper';
import { white, purple, red } from './colors';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const defaultFontConfig = {
    extraBold: { fontFamily: 'SFCompactDisplay-Black' },
    bold: { fontFamily: 'SFCompactDisplay-Bold' },
    semiBold: { fontFamily: 'SFCompactDisplay-Semibold' },
    medium: { fontFamily: 'SFCompactDisplay-Semibold' },
    regular: { fontFamily: 'SFCompactDisplay-Regular' },
    light: { fontFamily: 'SFCompactDisplay-Thin' },
    thin: { fontFamily: 'SFCompactDisplay-Thin' },
};
const fontConfig = {
    default: defaultFontConfig,
    ios: defaultFontConfig,
    android: defaultFontConfig,
};
export const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 4,
    fonts: configureFonts(fontConfig),
    colors: {
        primary: purple[400],
        background: white[400],
        surface: purple[50],
        accent: purple[500],
        error: red[500],
        text: purple[500],
        onPrimary: white[50],
        dark: purple[800],
        light: purple[200],
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
};
export type Theme = typeof theme;
