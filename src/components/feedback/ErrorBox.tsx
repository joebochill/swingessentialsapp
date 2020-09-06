import React from 'react';
// Components
import { StyleSheet, TextProps } from 'react-native';
import { Body } from '../../components';
import { useTheme } from 'react-native-paper';

// Styles
import { Theme } from '../../styles/theme';

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        error: {
            margin: 0,
            paddingVertical: theme.spaces.xSmall, // 4,
            paddingHorizontal: 16, // to match form field padding from RNP
            backgroundColor: theme.colors.error,
            color: theme.colors.onPrimary,
            fontSize: theme.fontSizes[14],
        },
    });
type ErrorBoxProps = TextProps & {
    show?: boolean;
    error: string;
};
export const ErrorBox = (props: ErrorBoxProps) => {
    const { style } = props;
    const theme = useTheme();
    const styles = useStyles(theme);

    return props.show ? <Body style={[styles.error, style]}>{props.error}</Body> : null;
};
