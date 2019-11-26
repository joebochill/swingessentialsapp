import React from 'react';
import { purple, transparent } from '../styles/colors';
import { spaces, sizes, unit, fonts } from '../styles/sizes';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

const styles = StyleSheet.create({
    purpleButton: {
        backgroundColor: purple[500],
        height: sizes.large,
        borderColor: purple[800],
        borderWidth: unit(2),
        borderRadius: unit(5),
    },
    // buttonContainer:{
    //     flex: 1
    // },
    linkButton: {
        backgroundColor: transparent,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: spaces.small,
        paddingBottom: spaces.small,
    },
});
type SEButtonProps = ButtonProps & {
    link?: boolean;
};
export const SEButton = ({ link, buttonStyle, titleStyle, ...props }: SEButtonProps) => (
    <Button
        titleStyle={[{ fontSize: fonts[14] }, titleStyle]}
        buttonStyle={[link ? styles.linkButton : styles.purpleButton, buttonStyle]}
        {...props}
    />
);
