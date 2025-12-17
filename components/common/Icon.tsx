import { useAppTheme } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TouchableOpacityProps } from 'react-native';

export type IconProps = React.ComponentProps<typeof MaterialIcons> & {
    onPress?: () => void;
    containerStyle?: TouchableOpacityProps['style'];
};

export const Icon: React.FC<IconProps> = (props) => {
    const theme = useAppTheme();
    const { onPress, containerStyle, size = theme.size.md, ...other } = props;
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                { alignItems: 'center', justifyContent: 'center' },
                ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
                { opacity: pressed ? 0.7 : 1 },
            ]}
            disabled={!onPress}
        >
            <MaterialIcons size={size} {...other} />
        </Pressable>
    );
};
