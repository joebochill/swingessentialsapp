import React, { useState, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { Stack, Typography } from '..';
import { useAppTheme } from '../../theme';

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
