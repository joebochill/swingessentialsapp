import React, { JSX } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SectionTitle } from '../typography';
import { useAppTheme } from '../../theme';
import { Stack } from './Stack';

type SectionHeaderProps = {
    title: string;
    action?: JSX.Element;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
};
export const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
    const { title, titleStyle, action, style } = props;
    const theme = useAppTheme();
    return (
        <Stack
            direction={'row'}
            align={'center'}
            justify={'space-between'}
            style={[{ marginBottom: theme.spacing.md }, ...(Array.isArray(style) ? style : [style])]}
        >
            <SectionTitle style={[{ color: theme.colors.onSurface }, titleStyle]}>{title}</SectionTitle>
            {action}
        </Stack>
    );
};
