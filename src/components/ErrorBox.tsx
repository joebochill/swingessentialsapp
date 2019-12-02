import React from 'react';
import { white, red, spaces, fonts } from '../styles';
import { StyleSheet, Text, ViewProps } from 'react-native';

const styles = StyleSheet.create({
    error: {
        margin: 0,
        padding: spaces.medium,
        backgroundColor: red[500],
        color: white[50],
        fontSize: fonts[14],
    },
});
type ErrorBoxProps = ViewProps & {
    show?: boolean;
    error: string;
};
export const ErrorBox = (props: ErrorBoxProps) =>
    props.show ? <Text style={StyleSheet.flatten([styles.error, props.style])}>{props.error}</Text> : null;
