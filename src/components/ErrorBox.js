import React from 'react';
import { colors, spacing } from '../styles/index';
import {
    StyleSheet,
    Text
} from 'react-native';
import { scale } from '../styles/dimension';


const styles = StyleSheet.create({
    error: {
        width: '100%',
        margin: 0,
        padding: spacing.normal,
        backgroundColor: colors.red,
        color: colors.white,
        fontSize: scale(14),
        marginTop: spacing.extraLarge
    }
})
export default ErrorBox = (props) => props.show ? (
    <Text style={StyleSheet.flatten([styles.error, props.style])}>
        {props.error}
    </Text>
) : null;