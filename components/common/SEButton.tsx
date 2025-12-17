import { Icon, IconProps } from '@/components/common/Icon';
import { useAppTheme } from '@/theme';
import { regularType } from '@/theme/fontConfig';
import React from 'react';
import { TextStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';

type SEButtonProps = Omit<ButtonProps, 'children' | 'icon'> & {
    icon?: IconProps['name'];
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
                          borderColor: theme.colors.outline,
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
            icon={
                icon
                    ? () => <Icon name={icon} size={20} color={(labelStyle as TextStyle)?.color ?? labelColor} />
                    : undefined
            }
            {...other}
        >
            {title}
        </Button>
    );
};
