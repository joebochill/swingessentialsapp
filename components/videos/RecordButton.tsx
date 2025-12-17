import { Icon } from '@/components/common/Icon';
import { Typography } from '@/components/typography/Typography';
import { useAppTheme } from '@/theme';
import React from 'react';
import { GestureResponderEvent, Pressable, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RecordButtonProps = TouchableOpacityProps & {
    recording: boolean;
    onPress: () => void;
};
export const RecordButton: React.FC<RecordButtonProps> = (props) => {
    const { recording, style, onPress, ...other } = props;
    const theme = useAppTheme();

    return (
        <Pressable
            onPress={(evt: GestureResponderEvent): void => onPress(evt)}
            style={({ pressed }) => [
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
                { opacity: pressed ? 0.7 : 1 },
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
        </Pressable>
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
            pointerEvents="box-none"
            style={[
                {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    paddingBottom: theme.spacing.md + insets.bottom,
                    backgroundColor: active ? 'transparent' : 'rgba(0,0,0,0.5)',
                },
            ]}
            {...other}
        >
            <Pressable
                onPress={onBack}
                disabled={active}
                style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.7 : 1 })}
            >
                {!active && (
                    <Typography variant={'bodyLarge'} color={'onPrimary'}>
                        {mode === 'record' ? 'Cancel' : 'Retake'}
                    </Typography>
                )}
            </Pressable>
            {mode === 'play' && (
                <Icon
                    name={active ? 'pause' : 'play-arrow'}
                    size={theme.size.xl}
                    // underlayColor={transparent}
                    color={theme.colors.onPrimary}
                    style={{ flex: 0 }}
                    onPress={onAction}
                />
            )}
            {mode === 'record' && <RecordButton style={{ flex: 0 }} recording={active} onPress={onAction} />}
            <Pressable
                onPress={onNext}
                disabled={active}
                style={({ pressed }) => ({
                    flex: 1,
                    alignItems: 'flex-end',
                    opacity: pressed ? 0.7 : 1,
                })}
            >
                {!active && mode === 'play' && (
                    <Typography variant={'bodyLarge'} color={'onPrimary'}>
                        Use Video
                    </Typography>
                )}
                {!active && mode === 'record' && (
                    <Icon
                        name={'flip-camera-ios'}
                        size={theme.size.md}
                        // underlayColor={transparent}
                        color={theme.colors.onPrimary}
                        onPress={onNext}
                    />
                )}
            </Pressable>
        </View>
    );
};
