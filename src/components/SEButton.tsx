import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button, Theme, useTheme } from 'react-native-paper';

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        label: {
            color: theme.colors.onPrimary,
        },
        textButton: {
            marginHorizontal: 0,
            color: theme.colors.text,
        },
        outlinedButton: {
            color: theme.colors.text,
        },
        dark: {
            backgroundColor: theme.colors.accent,
        },
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
            labelStyle={[
                styles.label,
                mode === 'text' ? styles.textButton : mode === 'outlined' ? styles.outlinedButton : {},
                labelStyle,
            ]}
            {...other}>
            {title}
        </Button>
    );
};
