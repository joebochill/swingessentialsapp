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
    backLabel: {
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

type RecordRowProps = ViewProps & {
    recording: boolean;
    onRecordPress: Function;
    onBack: Function;
    onCameraChange: Function;
}
export const RecordRow = ({ recording, onRecordPress, onBack, onCameraChange, ...props }: RecordRowProps) => {
    const insets = useSafeArea();
    return (
        <View style={[styles.recordRow, {
            bottom: insets.bottom,
            backgroundColor: recording ? transparent : blackOpacity(0.5)
        }]} {...props}>
            <TouchableOpacity
                onPress={() => onBack()}
                disabled={recording}
                style={{ flex: 1 }}
            >
                {!recording &&
                    <Body style={styles.backLabel}>Cancel</Body>
                }
            </TouchableOpacity>
            <RecordButton style={{ flex: 0 }}
                recording={recording}
                onPress={() => onRecordPress()}
            />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {!recording &&
                    <Icon
                        type={'ionicon'}
                        name={'ios-reverse-camera'}
                        size={sizes.medium}
                        underlayColor={transparent}
                        color={white[50]}
                        onPress={() => onCameraChange()}
                    />
                }
            </View>
        </View >
    );
}