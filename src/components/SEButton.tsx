import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button, Theme, useTheme } from 'react-native-paper';

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        label: {
            color: theme.colors.accent,
        },
        textButton: {
            marginHorizontal: 0,
        },
        dark: {
            backgroundColor: theme.colors.accent,
        },
        darkLabel: {
            color: theme.colors.onPrimary,
        }
    });

type SEButtonProps = React.ComponentProps<typeof Button> & {
    title: string;
    dark?: boolean;
};
export const SEButton: React.FC<SEButtonProps> = props => {
    const { title, mode = 'contained', dark = false, style, contentStyle, labelStyle, ...other } = props;
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        // @ts-ignore
        <Button
            uppercase={mode !== 'text'}
            mode={mode}
            style={[dark ? styles.dark : {}, style]}
            contentStyle={[contentStyle]}
            labelStyle={[dark ? styles.darkLabel : styles.label, mode === 'text' ? styles.textButton : {}, labelStyle]}
            {...other}>
            {title}
        </Button>
    );
};
