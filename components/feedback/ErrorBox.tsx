import React from 'react';
// Components
import { Typography } from '@/components/typography/Typography';
import { useAppTheme } from '@/theme';
import { TextProps } from 'react-native';

type ErrorBoxProps = TextProps & {
    show?: boolean;
    error: string;
};
export const ErrorBox: React.FC<ErrorBoxProps> = (props) => {
    const { style } = props;
    const theme = useAppTheme();

    return props.show ? (
        <Typography
            variant={'bodyLarge'}
            style={[
                {
                    margin: 0,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                    backgroundColor: theme.colors.error,
                    borderRadius: theme.roundness,
                    overflow: 'hidden',
                    color: theme.colors.onError,
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
        >
            {props.error}
        </Typography>
    ) : null;
};
