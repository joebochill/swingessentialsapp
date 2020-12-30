import { DefaultTheme, configureFonts } from 'react-native-paper';
import { white, purple, red, gray, black } from './colors';
import { spaceUnit, unit } from './sizes';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const defaultFontConfig = {
    extraBold: {
        // fontFamily: 'SFCompactDisplay-Black'
    },
    bold: {
        // fontFamily: 'SFCompactDisplay-Bold'
    },
    semiBold: {
        fontFamily: 'SFCompactDisplay-Semibold',
    },
    medium: {
        // fontFamily: 'SFCompactDisplay-Semibold'
    },
    regular: {
        // fontFamily: 'SFCompactDisplay-Regular'
    },
    light: {
        fontFamily: 'SFCompactDisplay-Thin',
    },
    thin: {
        // fontFamily: 'SFCompactDisplay-Thin'
    },
};
const fontConfig = {
    default: defaultFontConfig,
    ios: defaultFontConfig,
    android: defaultFontConfig,
};
export const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 0,
    fonts: configureFonts(fontConfig),
    colors: {
        primary: purple[400],
        background: white[400],
        surface: purple[50],
        accent: purple[500],
        error: red[500],
        text: purple[500],
        placeholder: black[500],
        onPrimary: white[50],
        dark: purple[800],
        light: purple[200],
    },
    sizes: {
        xSmall: spaceUnit(3),
        small: spaceUnit(6),
        medium: spaceUnit(8),
        large: spaceUnit(12),
        xLarge: spaceUnit(16),
        jumbo: spaceUnit(24),
    },
    spaces: {
        xSmall: spaceUnit(1), // 4
        small: spaceUnit(2), // 8
        medium: spaceUnit(4), // 16
        large: spaceUnit(6), // 24
        xLarge: spaceUnit(8), // 32
        jumbo: spaceUnit(12), // 48
    },
    fontSizes: {
        10: unit(10),
        12: unit(12),
        14: unit(14),
        16: unit(16),
        18: unit(18),
        20: unit(20),
        24: unit(24),
        34: unit(34),
        48: unit(48),
        60: unit(60),
        96: unit(96),
    },
};
export type Theme = typeof theme;
