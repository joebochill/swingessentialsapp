import React, { useState, useEffect } from 'react';
// Components
import { View, ViewProps } from 'react-native';
import { Body } from '../';
// Styles
import { useSharedStyles } from '../../styles';
import { blackOpacity } from '../../styles/colors';
import { unit } from '../../styles/sizes';
import { useTheme } from 'react-native-paper';

export type CountDownProps = ViewProps & {
    startValue: number;
    endValue?: number;
    onFinish?: Function;
};
export const CountDown = (props: CountDownProps) => {
    const { startValue, endValue = 0, onFinish = () => {} } = props;
    const [seconds, setSeconds] = useState(startValue);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);

    useEffect(() => {
        let interval: number = 0;
        if (seconds > endValue) {
            interval = setInterval(() => {
                setSeconds(sec => sec - 1);
            }, 1000);
        } else {
            onFinish();
        }

        return () => clearInterval(interval);
    }, [endValue, onFinish, seconds]);

    return seconds > endValue ? (
        <View
            style={[
                sharedStyles.absoluteFull,
                sharedStyles.centered,
                { backgroundColor: blackOpacity(0.25) },
                props.style,
            ]}>
            <Body style={{ color: theme.colors.onPrimary, fontSize: unit(128) }}>{seconds}</Body>
        </View>
    ) : null;
};

export type VideoTimerProps = ViewProps & {
    visible: boolean;
    startValue?: number;
    offset?: number;
};

export const VideoTimer = (props: VideoTimerProps) => {
    const { visible, startValue = 0, offset = -1 } = props;
    const [seconds, setSeconds] = useState(startValue);
    const theme = useTheme();

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds(sec => sec + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    const displaySeconds = Math.max(0, seconds + offset);

    return visible ? (
        <View {...props}>
            <View
                style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: -2 * unit(5),
                    bottom: 0,
                    right: 0,
                }}>
                <View
                    style={{
                        height: unit(5),
                        width: unit(5),
                        borderRadius: unit(5),
                        backgroundColor: 'red',
                    }}
                />
            </View>
            <Body style={{ fontSize: theme.fontSizes[14], color: theme.colors.onPrimary }}>
                {'00:00:' + (displaySeconds < 10 ? '0' : '') + displaySeconds}
            </Body>
        </View>
    ) : null;
};
