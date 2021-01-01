import React from 'react';
// Components
import {
    StyleSheet,
    View,
    ViewProps,
    TouchableOpacityProps,
    GestureResponderEvent,
    TouchableOpacity,
} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Body } from '../';

// Styles
import { transparent, blackOpacity } from '../../styles/colors';
import { unit } from '../../styles/sizes';

// Utilities
import { useSafeArea } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const useStyles = (theme: ReactNativePaper.Theme) =>
    StyleSheet.create({
        recordRow: {
            position: 'absolute',
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spaces.medium,
        },
        recordButton: {
            flex: 0,
            borderColor: theme.colors.onPrimary,
            borderWidth: unit(6),
            borderRadius: theme.sizes.xLarge,
            height: theme.sizes.xLarge,
            width: theme.sizes.xLarge,
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
            borderRadius: theme.sizes.xLarge,
        },
        innerStop: {
            height: theme.sizes.small,
            width: theme.sizes.small,
            backgroundColor: 'red',
            borderRadius: unit(2),
        },
        label: {
            fontSize: theme.fontSizes[16],
            color: theme.colors.onPrimary,
        },
    });
type RecordButtonProps = TouchableOpacityProps & {
    recording: boolean;
    onPress: Function;
};
export const RecordButton = (props: RecordButtonProps) => {
    const { recording, style, onPress, ...other } = props;
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <TouchableOpacity
            onPress={(evt: GestureResponderEvent) => onPress(evt)}
            style={StyleSheet.flatten([styles.recordButton, style])}
            {...other}
        >
            {!recording ? <View style={styles.innerRecord} /> : <View style={styles.innerStop} />}
        </TouchableOpacity>
    );
};

type VideoControlRowProps = ViewProps & {
    mode: 'record' | 'play';
    active: boolean;
    onAction: Function;
    onBack: Function;
    onNext: Function;
};
export const VideoControls = (props: VideoControlRowProps) => {
    const { mode, active, onAction, onBack, onNext, ...other } = props;
    const insets = useSafeArea();
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <View
            style={[
                styles.recordRow,
                {
                    bottom: insets.bottom,
                    backgroundColor: active ? transparent : blackOpacity(0.5),
                },
            ]}
            {...other}
        >
            <TouchableOpacity onPress={() => onBack()} disabled={active} style={{ flex: 1 }}>
                {!active && <Body style={styles.label}>{mode === 'record' ? 'Cancel' : 'Retake'}</Body>}
            </TouchableOpacity>
            {mode === 'play' && (
                <MatIcon
                    name={active ? 'pause' : 'play-arrow'}
                    size={theme.sizes.xLarge}
                    underlayColor={transparent}
                    color={theme.colors.onPrimary}
                    style={{ flex: 0 }}
                    onPress={() => onAction()}
                />
            )}
            {mode === 'record' && <RecordButton style={{ flex: 0 }} recording={active} onPress={() => onAction()} />}
            <TouchableOpacity onPress={() => onNext()} disabled={active} style={{ flex: 1, alignItems: 'flex-end' }}>
                {!active && mode === 'play' && <Body style={styles.label}>Use Video</Body>}
                {!active && mode === 'record' && (
                    <MaterialCommunityIcon
                        name={'camera-switch'}
                        size={theme.sizes.medium}
                        underlayColor={transparent}
                        color={theme.colors.onPrimary}
                        onPress={() => onNext()}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};
