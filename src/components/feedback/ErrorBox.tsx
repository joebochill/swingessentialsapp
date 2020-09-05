import React from 'react';
// Components
import { StyleSheet, TextProps } from 'react-native';
import { Body } from '../../components';
import { useTheme } from 'react-native-paper';

// Styles
import { spaces, fonts } from '../../styles/sizes';
import { white, red } from '../../styles/colors';

const styles = StyleSheet.create({
    error: {
        margin: 0,
        padding: spaces.medium,
        backgroundColor: red[500],
        color: white[50],
        fontSize: fonts[14],
    },
});
type ErrorBoxProps = TextProps & {
    show?: boolean;
    error: string;
};
export const ErrorBox = (props: ErrorBoxProps) => {
    const { style } = props;
    const theme = useTheme();
    return props.show ? (
        <Body style={StyleSheet.flatten([styles.error, { backgroundColor: theme.colors.error }, style])}>
            {props.error}
        </Body>
    ) : null;
};
