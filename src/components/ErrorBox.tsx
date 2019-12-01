import React from 'react';
import { white, red, spaces, fonts } from '../styles';
import { StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
    error: {
        width: '100%',
        margin: 0,
        padding: spaces.medium,
        backgroundColor: red[500],
        color: white[50],
        fontSize: fonts[14],
        marginTop: spaces.xLarge,
    },
});
type ErrorBoxProps = {
    show?: boolean;
    error: string;
    style?: StyleProp<ViewStyle>;
};
export const ErrorBox = (props: ErrorBoxProps) =>
    props.show ? <Text style={StyleSheet.flatten([styles.error, props.style])}>{props.error}</Text> : null;
