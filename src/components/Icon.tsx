import React from 'react';
import { IconProps as RNIconProps } from 'react-native-vector-icons/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconProps = RNIconProps & {
    family?: 'material' | 'material-community';
};

export const Icon: React.FC<IconProps> = (props) => {
    const { family = 'material', ...other } = props;

    return family === 'material-community' ? <MaterialCommunityIcon {...other} /> : <MaterialIcon {...other} />;
};
