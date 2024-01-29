import React, { useState, useEffect } from 'react';
// Components
import { View, ViewProps } from 'react-native';
import { Stack, Typography } from '../';
// Styles
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

export type VideoTimerProps = ViewProps & {
    visible: boolean;
    startValue?: number;
    offset?: number;
};

export const VideoTimer: React.FC<VideoTimerProps> = (props) => {
    const { visible, startValue = 0, offset = -1 } = props;
    const [seconds, setSeconds] = useState(startValue);
    const theme = useAppTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((sec) => sec + 1);
        }, 1000);
        return (): void => clearInterval(interval);
    }, [seconds]);

    const displaySeconds = Math.max(0, seconds + offset);

    return visible ? (
        <View {...props}>
            <Stack
                align={'flex-start'}
                justify={'center'}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: -10,
                    bottom: 0,
                    right: 0,
                }}
            >
                <View
                    style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: 'red',
                    }}
                />
            </Stack>
            <Typography style={{ fontSize: 14, color: theme.colors.onPrimary }}>
                {`00:00:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`}
            </Typography>
        </View>
    ) : null;
};
