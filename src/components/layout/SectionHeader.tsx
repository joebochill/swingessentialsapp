import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SectionTitle } from '../typography';
import { useAppTheme } from '../../styles/theme';
import { Stack } from './Stack';

type SectionHeaderProps = {
    title: string;
    action?: JSX.Element;
    style?: StyleProp<ViewStyle>;
};
export const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
    const { title, action, style } = props;
    const theme = useAppTheme();
    return (
        <Stack
            direction={'row'}
            align={'center'}
            justify={'space-between'}
            style={[{ marginBottom: theme.spacing.md }, ...(Array.isArray(style) ? style : [style])]}
        >
            <SectionTitle>{title}</SectionTitle>
            {action}
        </Stack>
    );
};
