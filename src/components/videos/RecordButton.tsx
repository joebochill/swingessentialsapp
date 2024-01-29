import React from 'react';

// Components
import { View, ViewProps, TouchableOpacityProps, GestureResponderEvent, TouchableOpacity } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from '../';

// Utilities
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';

type RecordButtonProps = TouchableOpacityProps & {
    recording: boolean;
    onPress: () => void;
};
export const RecordButton: React.FC<RecordButtonProps> = (props) => {
    const { recording, style, onPress, ...other } = props;
    const theme = useAppTheme();

    return (
        <TouchableOpacity
            onPress={(evt: GestureResponderEvent): void => onPress(evt)}
            style={[
                {
                    flex: 0,
                    borderColor: theme.colors.onPrimary,
                    borderWidth: theme.spacing.xs,
                    borderRadius: theme.size.xl,
                    height: theme.size.xl,
                    width: theme.size.xl,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: theme.spacing.xs / 2,
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...other}
        >
            {!recording ? (
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        alignSelf: 'stretch',
                        backgroundColor: 'red',
                        borderRadius: theme.size.xl,
                    }}
                />
            ) : (
                <View
                    style={{
                        height: theme.size.md,
                        width: theme.size.md,
                        backgroundColor: 'red',
                        borderRadius: theme.spacing.xs / 2,
                    }}
                />
            )}
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
    const theme = useAppTheme();

    return (
        <View
            style={[
                {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    bottom: insets.bottom,
                    backgroundColor: active ? 'transparent' : 'rgba(0,0,0,0.5)',
                },
            ]}
            {...other}
        >
            <TouchableOpacity onPress={onBack} disabled={active} style={{ flex: 1 }}>
                {!active && (
                    <Typography variant={'bodyLarge'} color={'onPrimary'}>
                        {mode === 'record' ? 'Cancel' : 'Retake'}
                    </Typography>
                )}
            </TouchableOpacity>
            {mode === 'play' && (
                <MatIcon
                    name={active ? 'pause' : 'play-arrow'}
                    size={theme.size.xl}
                    // underlayColor={transparent}
                    color={theme.colors.onPrimary}
                    style={{ flex: 0 }}
                    onPress={onAction}
                />
            )}
            {mode === 'record' && <RecordButton style={{ flex: 0 }} recording={active} onPress={onAction} />}
            <TouchableOpacity onPress={onNext} disabled={active} style={{ flex: 1, alignItems: 'flex-end' }}>
                {!active && mode === 'play' && (
                    <Typography variant={'bodyLarge'} color={'onPrimary'}>
                        Use Video
                    </Typography>
                )}
                {!active && mode === 'record' && (
                    <MaterialCommunityIcon
                        name={'camera-switch'}
                        size={theme.size.md}
                        // underlayColor={transparent}
                        color={theme.colors.onPrimary}
                        onPress={onNext}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};
