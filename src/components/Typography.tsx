import React from 'react';
import { Text, TextProps, TextStyle, StyleProp, I18nManager, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { unit } from '../styles/sizes';
import { $DeepPartial } from '@callstack/react-theme-provider';
import { Theme } from '../styles/theme';

export type TypographyProps = {
    /**
     * Key to use for font size.
     */
    fontSize?: number;

    /**
     * Font to use
     */
    font?: keyof Theme['fonts'];

    /**
     * Font to use
     */
    color?: keyof Theme['colors'];

    /** Style Overrides */
    styles?: {
        root?: StyleProp<TextStyle>;
    };
} & TextProps;
/*
 * createTypography is a component-generator function. It takes one argument.
 *     getStyle: a function that takes in a theme and returns a text style object
 * createTypography returns a theme-wrapped text component that utilizes that styles and theme that are provided
 */
const createTypography = (getStyle: (theme: Theme) => StyleProp<TextStyle>): React.FC<TypographyProps> => ({
    font,
    fontSize,
    color,
    style,
    ...props
}): JSX.Element => {
    const theme = useTheme();

    let customStyle: StyleProp<TextStyle> = {};
    if (fontSize) {
        customStyle.fontSize = fontSize;
    }
    if (font) {
        customStyle = {
            ...customStyle,
            ...theme.fonts[font],
        };
    }

    return (
        <Text
            {...props}
            style={[{ color: color ? theme.colors[color] : theme.colors.text }, getStyle(theme), customStyle, style]}
        />
    );
};

/**
 * Typography Components
 */

export const H4 = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[34],
}));
export const H5 = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[24],
}));
export const H6 = createTypography(theme => ({
    // ...theme.fonts.semiBold,
    fontSize: theme.fontSizes[20],
    letterSpacing: 0,
}));
export const H7 = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[18],
}));
export const Body = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[16],
}));
export const Label = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[16],
    letterSpacing: 0,
}));
export const Subtitle = createTypography(theme => ({
    // ...theme.fonts.semiBold,
    fontSize: theme.fontSizes[14],
}));
export const Caption = createTypography(theme => ({
    // ...theme.fonts.regular,
    fontSize: theme.fontSizes[10],
}));
