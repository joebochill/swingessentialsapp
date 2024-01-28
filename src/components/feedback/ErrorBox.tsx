import React from 'react';
// Components
import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native';
import { Typography } from '../../components';
import { MD3Theme, useTheme } from 'react-native-paper';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    error: StyleProp<TextStyle>;
}> =>
    StyleSheet.create({
        error: {
            margin: 0,
            // paddingVertical: theme.spaces.xSmall, // 4,
            paddingHorizontal: 16, // to match form field padding from RNP
            backgroundColor: theme.colors.error,
            color: theme.colors.onPrimary,
            // fontSize: theme.fontSizes[14],
        },
    });
type ErrorBoxProps = TextProps & {
    show?: boolean;
    error: string;
};
export const ErrorBox: React.FC<ErrorBoxProps> = (props) => {
    const { style } = props;
    const theme = useTheme();
    const styles = useStyles(theme);

    return props.show ? <Typography style={[styles.error, style]}>{props.error}</Typography> : null;
};
