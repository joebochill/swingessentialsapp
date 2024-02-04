import React, { useState, useEffect } from 'react';
import { ViewProps } from 'react-native';
import { Stack, Typography } from '..';
import { useAppTheme } from '../../theme';

export type CountDownProps = ViewProps & {
    startValue: number;
    endValue?: number;
    onFinish?: () => void;
};
export const CountDown: React.FC<CountDownProps> = (props) => {
    const { startValue, endValue = 0, onFinish = (): void => {} } = props;
    const [seconds, setSeconds] = useState(startValue);
    const theme = useAppTheme();

    useEffect(() => {
        let interval: any = 0;
        if (seconds > endValue) {
            interval = setInterval(() => {
                setSeconds((sec) => sec - 1);
            }, 1000);
        } else {
            onFinish();
        }

        return (): void => clearInterval(interval);
    }, [endValue, onFinish, seconds]);

    return seconds > endValue ? (
        <Stack
            align={'center'}
            justify={'center'}
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                { backgroundColor: 'rgba(0,0,0,0.25)' },
                props.style,
            ]}
        >
            <Typography style={{ color: theme.colors.onPrimary, fontSize: 128 }}>{seconds}</Typography>
        </Stack>
    ) : null;
};
