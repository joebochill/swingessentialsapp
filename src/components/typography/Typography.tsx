import React, { JSX } from 'react';
import { MD3Theme, Text, TextProps, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';
import { extraBoldType, lightType, regularType, semiBoldType } from '../../theme/typography/fontConfig';
import { TextStyle } from 'react-native';

type FontWeight = 'bold' | 'regular' | 'light' | 'semiBold' | 'extraBold';
export type TypographyProps<T> = {
    /**
     * Font Size.
     */
    fontSize?: number;

    /**
     * Font Weight
     */
    fontWeight?: FontWeight;

    /**
     * Font Color
     */
    color?: keyof MD3Theme['colors'];

    /**
     * Text Alignment
     */
    center?: boolean;

    /**
     * Text Transform
     */
    uppercase?: boolean;

    /**
     * Text Alignment
     */
    align?: TextStyle['textAlign'];
} & TextProps<T>;

const getFontWeight = (
    weight: FontWeight
): {
    fontFamily: string;
    fontWeight?: 'bold' | '300' | 'normal' | '100' | '200' | '400' | '500' | '600' | '700' | '800' | '900';
} => {
    switch (weight) {
        case 'light':
            return lightType;
        case 'regular':
            return regularType;
        case 'semiBold':
            return semiBoldType;
        case 'bold':
            return semiBoldType;
        case 'extraBold':
            return extraBoldType;
        default:
            return regularType;
    }
};

export const Typography = <T,>(props: TypographyProps<T>): JSX.Element => {
    const { fontSize, fontWeight, color, align, uppercase, variant, center, style, ...textProps } = props;
    const theme = useTheme();
    return (
        <Text
            variant={variant as VariantProp<never>}
            style={[
                fontSize ? { fontSize } : {},
                fontWeight ? getFontWeight(fontWeight) : {},
                color ? { color: theme.colors[color] as string } : {},
                center ? { textAlign: 'center' } : {},
                uppercase ? { textTransform: 'uppercase' } : {},
                align ? { textAlign: align } : {},
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...textProps}
        />
    );
};
