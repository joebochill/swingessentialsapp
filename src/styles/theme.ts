import { createTheming } from '@callstack/react-theme-provider';
import { TextStyle } from 'react-native';
import { white, purple, red, green, orange } from '../styles/colors';
import { ColorDef } from '../__types__';

type Font = {
    fontFamily: string;
    fontWeight: TextStyle['fontWeight'];
};

export interface Theme {
    roundness: number;
    colors: {
        primary: ColorDef;
        background: string;
        surface: string;
        accent: ColorDef;
        error: ColorDef;
        text: ColorDef;
        onPrimary: ColorDef;
    };
    fonts: {
        extraBold: Partial<Font>;
        bold: Partial<Font>;
        semiBold: Partial<Font>;
        regular: Partial<Font>;
        light: Partial<Font>;
    };
    sizes: {
        tiny: number;
        extraSmall: number;
        small: number;
        medium: number;
        large: number;
        extraLarge: number;
        giant: number;
    };
}

/* This is the default theme for the component library (Material) */
export const defaultTheme = {
    roundness: 8,
    fonts: {
        extraBold: { fontFamily: 'SFCompactDisplay-Black' },
        bold: { fontFamily: 'SFCompactDisplay-Bold' },
        semiBold: { fontFamily: 'SFCompactDisplay-Semibold' },
        regular: { fontFamily: 'SFCompactDisplay-Regular' },
        light: { fontFamily: 'SFCompactDisplay-Thin' },
    },
    colors: {
        primary: purple,
        background: white[400],
        surface: purple[50],
        accent: purple,
        error: red,
        text: purple,
        onPrimary: white,
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

const { ThemeProvider, withTheme, useTheme } = createTheming<Theme>(defaultTheme);

export type WithTheme<T> = T & {
    theme: Theme;
};

export { ThemeProvider, withTheme, useTheme };
