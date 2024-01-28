import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { regularType } from '../styles/typography/fontConfig';
import { useAppTheme } from '../styles/theme';

type SEButtonProps = Omit<ButtonProps, 'children'> & {
    title: string;
    dark?: boolean;
};
export const SEButton: React.FC<SEButtonProps> = (props) => {
    const { title, mode = 'contained', labelStyle, ...other } = props;
    const theme = useAppTheme();

    return (
        <Button
            mode={mode}
            uppercase={mode !== 'text'}
            // buttonColor={mode === 'contained' ? theme.colors.secondary : undefined}
            labelStyle={[regularType, ...(Array.isArray(labelStyle) ? labelStyle : [labelStyle])]}
            {...other}
        >
            {title}
        </Button>
    );
};
