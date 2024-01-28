import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { regularType } from '../styles/typography/fontConfig';

type SEButtonProps = Omit<ButtonProps, 'children'> & {
    title: string;
    dark?: boolean;
};
export const SEButton: React.FC<SEButtonProps> = (props) => {
    const { title, mode = 'contained', labelStyle, ...other } = props;

    return (
        <Button
            mode={mode}
            uppercase={mode !== 'text'}
            labelStyle={[regularType, ...(Array.isArray(labelStyle) ? labelStyle : [labelStyle])]}
            {...other}
        >
            {title}
        </Button>
    );
};
