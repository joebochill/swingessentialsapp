import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { regularType } from '../theme/typography/fontConfig';
import { useAppTheme } from '../theme';
import { Icon, MaterialIconName } from './Icon';

type SEButtonProps = Omit<ButtonProps, 'children' | 'icon'> & {
    icon?: MaterialIconName;
    title: string;
};
export const SEButton: React.FC<SEButtonProps> = (props) => {
    const { title, mode = 'contained', labelStyle, icon, style, ...other } = props;
    const theme = useAppTheme();

    const labelColor = mode === 'outlined' ? theme.colors.onSurface : theme.colors.onPrimary;
    return (
        <Button
            mode={mode}
            uppercase={mode !== 'text'}
            style={[
                mode === 'outlined'
                    ? {
                          borderColor: theme.colors.onSurface,
                      }
                    : theme.dark && mode === 'contained'
                    ? {
                          borderWidth: 1,
                          borderColor: theme.colors.outline,
                      }
                    : {},
                ...(Array.isArray(style) ? style : [style]),
            ]}
            labelStyle={[
                regularType,
                { color: labelColor },
                ...(Array.isArray(labelStyle) ? labelStyle : [labelStyle]),
            ]}
            icon={icon ? () => <Icon name={icon} size={20} color={labelColor} /> : undefined}
            {...other}
        >
            {title}
        </Button>
    );
};
