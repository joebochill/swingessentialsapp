import React from 'react';
// Components
import { TextProps } from 'react-native';
import { useAppTheme } from '../../theme';
import { Typography } from '../typography';

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
