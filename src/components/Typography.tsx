import React from 'react';
import { MD3Theme, Text, TextProps, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

export type TypographyProps<T> = {
    /**
     * Key to use for font size.
     */
    fontSize?: number;

    /**
     * Font to use
     */
    fontWeight?: 'bold' | 'regular' | 'light' | 'medium' | 'semiBold';

    /**
     * Color to use
     */
    color?: keyof MD3Theme['colors'];
} & TextProps<T>;

export const Typography = <T,>(props: TypographyProps<T>): JSX.Element => {
    const { fontSize, fontWeight, color, variant, ...textProps } = props;
    return (
        <Text variant={variant as VariantProp<never>} {...textProps} />
    )
}
/*
 * createTypography is a component-generator function. It takes one argument.
 *     getStyle: a function that takes in a theme and returns a text style object
 * createTypography returns a theme-wrapped text component that utilizes that styles and theme that are provided
 */
// const createTypography =
//     (getStyle: (theme: MD3Theme) => StyleProp<TextStyle>): React.FC<TypographyProps> =>
//     ({ font, fontSize, color, style, ...props }): JSX.Element => {
//         const theme = useTheme();

//         let customStyle: StyleProp<TextStyle> = {};
//         if (fontSize) {
//             customStyle.fontSize = fontSize;
//         }
//         if (font) {
//             customStyle = {
//                 ...customStyle,
//                 // ...theme.fonts[font],
//             };
//         }

//         return (
//             <Text
//                 {...props}
//                 style={[
//                     // { color: color ? theme.colors[color] : theme.colors.text },
//                     getStyle(theme),
//                     customStyle,
//                     style,
//                 ]}
//             />
//         );
//     };

/**
 * Typography Components
 */

// export const H4 = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[34],
// }));
// export const H5 = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[24],
// }));
// export const H6 = createTypography((theme) => ({
//     // ...theme.fonts.semiBold,
//     // fontSize: theme.fontSizes[20],
//     letterSpacing: 0,
// }));
// export const H7 = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[18],
// }));
// export const Body = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[16],
// }));
// export const Label = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[16],
//     letterSpacing: 0,
// }));
// export const Subtitle = createTypography((theme) => ({
//     // ...theme.fonts.semiBold,
//     // fontSize: theme.fontSizes[14],
// }));
// export const Caption = createTypography((theme) => ({
//     // ...theme.fonts.regular,
//     // fontSize: theme.fontSizes[10],
// }));
