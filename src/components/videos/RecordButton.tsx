import React from 'react';
// Components
import {
    StyleSheet,
    View,
    ViewProps,
    TouchableOpacityProps,
    GestureResponderEvent,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from '../';

// Styles
import { transparent, blackOpacity } from '../../styles/colors';
import { unit } from '../../styles/sizes';

// Utilities
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MD3Theme, useTheme } from 'react-native-paper';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    recordRow: StyleProp<ViewStyle>;
    recordButton: StyleProp<ViewStyle>;
    innerRecord: StyleProp<ViewStyle>;
    innerStop: StyleProp<ViewStyle>;
    label: StyleProp<TextStyle>;
}> =>
    StyleSheet.create({
        recordRow: {
            position: 'absolute',
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            // padding: theme.spaces.medium,
        },
        recordButton: {
            flex: 0,
            borderColor: theme.colors.onPrimary,
            borderWidth: unit(6),
            // borderRadius: theme.sizes.xLarge,
            // height: theme.sizes.xLarge,
            // width: theme.sizes.xLarge,
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
            // borderRadius: theme.sizes.xLarge,
        },
        innerStop: {
            // height: theme.sizes.small,
            // width: theme.sizes.small,
            backgroundColor: 'red',
            borderRadius: unit(2),
        },
        label: {
            // fontSize: theme.fontSizes[16],
            color: theme.colors.onPrimary,
        },
    });
type RecordButtonProps = TouchableOpacityProps & {
    recording: boolean;
    onPress: () => void;
};
export const RecordButton: React.FC<RecordButtonProps> = (props) => {
    const { recording, style, onPress, ...other } = props;
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <TouchableOpacity
            onPress={(evt: GestureResponderEvent): void => onPress(evt)}
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
    onAction: () => void;
    onBack: () => void;
    onNext: () => void;
};
export const VideoControls: React.FC<VideoControlRowProps> = (props) => {
    const { mode, active, onAction, onBack, onNext, ...other } = props;
    const insets = useSafeAreaInsets();
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
            <TouchableOpacity onPress={onBack} disabled={active} style={{ flex: 1 }}>
                {!active && <Typography style={styles.label}>{mode === 'record' ? 'Cancel' : 'Retake'}</Typography>}
            </TouchableOpacity>
            {mode === 'play' && (
                <MatIcon
                    name={active ? 'pause' : 'play-arrow'}
                    // size={theme.sizes.xLarge}
                    // underlayColor={transparent}
                    color={theme.colors.onPrimary}
                    style={{ flex: 0 }}
                    onPress={onAction}
                />
            )}
            {mode === 'record' && <RecordButton style={{ flex: 0 }} recording={active} onPress={onAction} />}
            <TouchableOpacity onPress={onNext} disabled={active} style={{ flex: 1, alignItems: 'flex-end' }}>
                {!active && mode === 'play' && <Typography style={styles.label}>Use Video</Typography>}
                {!active && mode === 'record' && (
                    <MaterialCommunityIcon
                        name={'camera-switch'}
                        // size={theme.sizes.medium}
                        // underlayColor={transparent}
                        color={theme.colors.onPrimary}
                        onPress={onNext}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};
