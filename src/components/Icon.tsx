import React from 'react';
import { IconProps as RNIconProps } from 'react-native-vector-icons/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export type IconProps = RNIconProps & {
    family?: 'material' | 'material-community';
    onPress?: () => void;
    containerStyle?: TouchableOpacityProps['style'];
};

export const Icon: React.FC<IconProps> = (props) => {
    const { family = 'material', onPress, containerStyle, ...other } = props;
    return (
        <TouchableOpacity onPress={onPress} style={containerStyle} disabled={!onPress}>
            {family === 'material-community' ? <MaterialCommunityIcon {...other} /> : <MaterialIcon {...other} />}
        </TouchableOpacity>
    );
};
