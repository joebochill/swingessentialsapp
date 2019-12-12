import React from 'react';
import { transparent, spaces, sizes, unit, fonts, blackOpacity, white } from '../styles';
import { StyleSheet, View, ViewProps, TouchableOpacityProps, GestureResponderEvent, SafeAreaView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Body } from '@pxblue/react-native-components';
import { useSafeArea } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    recordRow: {
        position: 'absolute',
        left: 0, right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spaces.medium,
    },
    recordButton: {
        flex: 0,
        borderColor: white[50],
        borderWidth: unit(6),
        borderRadius: sizes.xLarge,
        height: sizes.xLarge,
        width: sizes.xLarge,
        alignItems: 'center',
        justifyContent: 'center',
        padding: unit(2),
    },
    innerRecord: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'stretch',
        backgroundColor: 'red',
        borderRadius: sizes.xLarge
    },
    innerStop: {
        height: sizes.small,
        width: sizes.small,
        backgroundColor: 'red',
        borderRadius: unit(2)
    },
    label: {
        fontSize: fonts[16],
        color: white[50],
    },
});
type RecordButtonProps = TouchableOpacityProps & {
    recording: boolean;
    onPress: Function;
};
export const RecordButton = ({ recording, onPress, style, ...props }: RecordButtonProps) => {

    return (
        <TouchableOpacity
            onPress={(evt: GestureResponderEvent) => onPress(evt)}
            style={styles.recordButton}
            {...props}
        >
            {!recording ?
                <View style={styles.innerRecord} />
                :
                <View style={styles.innerStop} />
            }
        </TouchableOpacity>
    )
};

type VideoControlRowProps = ViewProps & {
    mode: 'record' | 'play';
    active: boolean;
    onAction: Function;
    onBack: Function;
    onNext: Function;
}
export const VideoControls = ({ mode, active, onAction, onBack, onNext, ...props }: VideoControlRowProps) => {
    const insets = useSafeArea();
    return (
        <View style={[styles.recordRow, {
            bottom: insets.bottom,
            backgroundColor: active ? transparent : blackOpacity(0.5)
        }]} {...props}>
            <TouchableOpacity
                onPress={() => onBack()}
                disabled={active}
                style={{ flex: 1 }}
            >
                {!active &&
                    <Body style={styles.label}>
                        {mode === 'record' ? 'Cancel' : 'Retake'}
                    </Body>
                }
            </TouchableOpacity>
            {mode === 'play' &&
                <Icon
                    name={active ? 'pause' : 'play-arrow'}
                    size={sizes.xLarge}
                    underlayColor={transparent}
                    color={white[50]}
                    style={{ flex: 0 }}
                    onPress={() => onAction()}
                />
            }
            {mode === 'record' &&
                <RecordButton style={{ flex: 0 }}
                    recording={active}
                    onPress={() => onAction()}
                />
            }
            <TouchableOpacity
                onPress={() => onNext()}
                disabled={active}
                style={{ flex: 1, alignItems: 'flex-end' }}
            >
                {!active && mode === 'play' &&
                    <Body style={styles.label}>Use Video</Body>
                }
                {!active && mode === 'record' &&
                    <Icon
                        type={'ionicon'}
                        name={'ios-reverse-camera'}
                        size={sizes.medium}
                        underlayColor={transparent}
                        color={white[50]}
                        onPress={() => onNext()}
                    />
                }
            </TouchableOpacity>

        </View >
    );
}