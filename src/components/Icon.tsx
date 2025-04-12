import React from 'react';
import { IconProps as RNIconProps } from '@react-native-vector-icons/common';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useAppTheme } from '../theme';

export type MaterialIconName = React.ComponentProps<typeof MaterialIcon>['name'];
export type IconProps = RNIconProps<MaterialIconName> & {
    onPress?: () => void;
    containerStyle?: TouchableOpacityProps['style'];
};

export const Icon: React.FC<IconProps> = (props) => {
    const theme = useAppTheme();
    const { onPress, containerStyle, size = theme.size.md, ...other } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                { alignItems: 'center', justifyContent: 'center' },
                ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
            ]}
            disabled={!onPress}
        >
            <MaterialIcon size={size} {...other} />
        </TouchableOpacity>
    );
};
