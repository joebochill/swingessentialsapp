import React from 'react';
import { colors, spacing, sizes } from '../styles/index';
import {
    StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { scale } from '../styles/dimension';


const styles = StyleSheet.create({
    purpleButton: {
        backgroundColor: colors.lightPurple,
        height: sizes.normal,
        borderColor: colors.purple,
        borderWidth: scale(2),
        borderRadius: scale(5),
        marginTop: spacing.normal,
        marginLeft: 0,
        marginRight: 0
    },
    linkButton: {
        backgroundColor: colors.transparent,
        paddingLeft: 0,
        paddingRight:0,
        paddingTop: spacing.small,
        paddingBottom: spacing.small
    },
})
export default SEButton = ({link, buttonStyle, containerStyle, ...props}) => (
    <Button
        fontSize={scale(14)}
        buttonStyle={StyleSheet.flatten([
            link ? styles.linkButton : styles.purpleButton, 
            buttonStyle
        ])}
        containerStyle={StyleSheet.flatten([
            { flex: 1, marginHorizontal: 0, flex: 0 }, 
            containerStyle
        ])}
        {...props}
    />
);