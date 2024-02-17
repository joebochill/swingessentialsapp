import React, { useState, useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { Stack, Typography } from '..';
import { useAppTheme } from '../../theme';

export type VideoTimerProps = ViewProps & {
    visible: boolean;
    startValue?: number;
};

export const VideoTimer: React.FC<VideoTimerProps> = (props) => {
    const { visible, startValue = 0 } = props;

    const [startTime, setStartTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const theme = useAppTheme();

    useEffect(() => {
        if (visible) {
            const now = Date.now();
            setStartTime(now);
            setCurrentTime(now);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentTime(Date.now());
            }, 10);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [visible]);

    let secondsPassed = 0;
    if (startTime !== null && currentTime !== null) {
        secondsPassed = (currentTime - startTime) / 1000;
    }

    const displaySeconds = Math.floor(Math.max(0, secondsPassed + startValue));

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
