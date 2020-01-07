import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';
import { Body } from '../components';

// Styles
import { transparent } from '../styles/colors';
import { spaces, sizes, unit, fonts } from '../styles/sizes';
import { useTheme } from '../styles/theme';

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
    title: string;
};
export const SEButton = (props: SEButtonProps) => {
    const { link, buttonStyle, title, titleStyle, ...other } = props;
    const theme = useTheme();
    return (
        <Button
            buttonStyle={StyleSheet.flatten([
                link
                    ? styles.linkButton
                    : [
                          styles.purpleButton,
                          {
                              backgroundColor: theme.colors.primary[400],
                              borderColor: theme.colors.primary[800],
                          },
                      ],
                buttonStyle,
            ])}
            title={
                <Body
                    style={StyleSheet.flatten([
                        { color: theme.colors.onPrimary[50], fontSize: fonts[14] },
                        titleStyle,
                    ])}>
                    {!link ? title.toUpperCase() : title}
                </Body>
            }
            {...other}
        />
    );
};
