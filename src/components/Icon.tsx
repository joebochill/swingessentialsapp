import React from 'react';
import { IconProps as RNIconProps } from 'react-native-vector-icons/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useAppTheme } from '../theme';

export type IconProps = RNIconProps & {
    family?: 'material' | 'material-community';
    onPress?: () => void;
    containerStyle?: TouchableOpacityProps['style'];
};

export const Icon: React.FC<IconProps> = (props) => {
    const theme = useAppTheme();
    const { family = 'material', onPress, containerStyle, size = theme.size.md, ...other } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                { alignItems: 'center', justifyContent: 'center' },
                ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
            ]}
            disabled={!onPress}
        >
            {family === 'material-community' ? (
                <MaterialCommunityIcon size={size} {...other} />
            ) : (
                <MaterialIcon size={size} {...other} />
            )}
        </TouchableOpacity>
    );
};
