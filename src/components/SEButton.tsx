import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';
// Styles
import { transparent } from '../styles/colors';
import { spaces, sizes, unit, fonts } from '../styles/sizes';
import { useTheme } from '../styles/theme'

const styles = StyleSheet.create({
    purpleButton: {
        height: sizes.large,
        borderWidth: unit(2),
        borderRadius: unit(5),
    },
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
export const SEButton = (props: SEButtonProps) => {
    const { link, buttonStyle, titleStyle, ...other } = props;
    const theme = useTheme();
    return (
        <Button
            titleStyle={StyleSheet.flatten([{ fontSize: fonts[14], color: theme.colors.onPrimary[50] }, titleStyle])}
            buttonStyle={StyleSheet.flatten([
                link ? styles.linkButton : [styles.purpleButton, {
                    backgroundColor: theme.colors.primary[500],
                    borderColor: theme.colors.primary[800],
                }], 
                buttonStyle
            ])}
            {...other}
        />
    )
};
