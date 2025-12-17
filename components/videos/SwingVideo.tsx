import React, { useCallback, useEffect, useRef, useState } from 'react';
// Components
import { useVideoPlayer, VideoView } from 'expo-video';
import {
    Alert,
    // Alert,
    ImageBackground,
    ImageSourcePropType,
    Pressable,
    PressableProps,
    View,
} from 'react-native';

// Styles
import { PickerModal } from '@/components/inputs/PickerModal';
import { useAppTheme } from '@/theme';
import { aspectWidth, width as deviceWidth } from '@/utilities/dimensions';
// import { Asset, launchImageLibrary } from "react-native-image-picker";
import { launchImageLibraryAsync, useMediaLibraryPermissions } from 'expo-image-picker';
import { ActivityIndicator } from 'react-native-paper';

import dtlDark from '@/assets/images/down-the-line-dark.png';
import dtl from '@/assets/images/down-the-line.png';
import foDark from '@/assets/images/face-on-dark.png';
import fo from '@/assets/images/face-on.png';
import { Icon, IconProps } from '@/components/common/Icon';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { useEvent } from 'expo';
import { openSettings } from 'expo-linking';
import { useRouter } from 'expo-router';

type SwingVideoPlaceholderProps = {
    type?: 'fo' | 'dtl';
    title?: string;
    backgroundImage?: ImageSourcePropType;
    editIcon?: IconProps;
};

export const SwingVideoPlaceholder: React.FC<SwingVideoPlaceholderProps> = (props) => {
    const theme = useAppTheme();
    const { title, type, backgroundImage, editIcon } = props;

    return (
        <ImageBackground
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: theme.spacing.md,
            }}
            imageStyle={{
                height: '100%',
                width: '100%',
                resizeMode: 'contain',
            }}
            resizeMethod={'resize'}
            source={
                backgroundImage ??
                (type === 'fo' ? (theme.dark ? foDark : fo) : type === 'dtl' ? (theme.dark ? dtlDark : dtl) : undefined)
            }
        >
            <SectionHeader title={(title ?? type === 'fo') ? 'Face-On' : type === 'dtl' ? 'Down-the-Line' : ''} />
            {editIcon && <Icon color={'onPrimary'} {...editIcon} />}
        </ImageBackground>
    );
};
type SwingVideoProps = Omit<PressableProps, 'onPress'> & {
    type: 'fo' | 'dtl';
    width?: number;
    height?: number;
    source?: string;
    onSourceChange?: (source: string | undefined) => void;
    editable?: boolean;
    loading?: boolean;
    PlaceholderProps?: Partial<SwingVideoPlaceholderProps>;
};

export const SwingVideo: React.FC<SwingVideoProps> = (props) => {
    const theme = useAppTheme();
    const router = useRouter();
    const {
        type,
        width = (deviceWidth - 3 * theme.spacing.md) / 2,
        height = aspectWidth(width),
        source,
        onSourceChange,
        loading,
        editable,
        PlaceholderProps = {},
        style,
        ...other
    } = props;

    // Play Video
    const player = useVideoPlayer(source ?? '');
    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });
    const { status } = useEvent(player, 'statusChange', {
        status: player.status,
    });

    const [permission, requestPermission] = useMediaLibraryPermissions();

    const videoRef = useRef<VideoView>(null);
    const [videoReady, setVideoReady] = useState(false);

    // Choose Video
    const [showPicker, setShowPicker] = useState(false);

    // Video loading
    const [processing, setProcessing] = useState(false);

    const placeholderProps = {
        type,
        editIcon: {
            name: 'add-a-photo',
            color: theme.dark ? theme.colors.onPrimary : theme.colors.onPrimaryContainer,
            size: theme.size.md,
        },
        ...PlaceholderProps,
    };

    useEffect(() => {
        if (status === 'idle') {
            player.currentTime = 0;
            player.pause();
        }
    });

    const handlePress = useCallback(() => {
        if (source && videoReady) {
            if (isPlaying) {
                player.pause();
            } else {
                player.play();
            }
        } else if (!source) {
            setShowPicker(true);
        }
    }, [source, videoReady, isPlaying, player]);

    useEffect(() => {
        if (!source) {
            player.pause();
            setVideoReady(false);
        }
    }, [source, player]);

    return (
        <>
            <Pressable
                style={(state) => [
                    {
                        width,
                        height,
                        borderRadius: theme.roundness,
                    },
                    source
                        ? {
                              backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                          }
                        : {
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderColor: theme.colors.outline,
                              backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                          },
                    ...(Array.isArray(style) ? style : typeof style === 'function' ? [style(state)] : [style]),
                    { opacity: state.pressed ? 0.7 : 1 },
                ]}
                onPress={handlePress}
                {...other}
            >
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: theme.roundness,
                        overflow: 'hidden',
                    }}
                >
                    {!source ? (
                        !processing && <SwingVideoPlaceholder {...(placeholderProps as any)} />
                    ) : (
                        <VideoView
                            ref={videoRef}
                            player={player}
                            onFirstFrameRender={() => setVideoReady(true)}
                            contentFit="contain"
                            nativeControls={false}
                            style={{
                                height: '100%',
                                width: '100%',
                                backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                            }}
                        />
                    )}
                </View>
                {((source && !videoReady) || loading || processing) && (
                    <ActivityIndicator
                        size={theme.size.xl}
                        color={theme.colors.onPrimaryContainer}
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            top: 0,
                            left: 0,
                        }}
                    />
                )}
                {videoReady && !loading && !processing && (
                    <View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            top: 0,
                            left: 0,
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name={'play-circle'}
                            size={theme.size.xxl}
                            color={theme.colors.onPrimary}
                            style={{
                                opacity: isPlaying ? 0 : 1,
                            }}
                        />
                    </View>
                )}
                {source && !isPlaying && editable && !processing && (
                    <Pressable
                        style={({ pressed }) => [
                            {
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                left: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: theme.spacing.md,
                                opacity: pressed ? 0.7 : 1,
                            },
                        ]}
                        onPress={(): void => setShowPicker(true)}
                    >
                        <Icon name={'edit'} size={theme.size.md} color={theme.colors.onPrimary} />
                    </Pressable>
                )}
            </Pressable>
            <PickerModal
                isVisible={showPicker}
                onBackdropPress={processing ? undefined : (): void => setShowPicker(false)}
                style={{ opacity: processing ? 0 : 1 }}
                backdropOpacity={processing ? 0 : undefined}
                menuOptions={[
                    {
                        label: 'Choose From Library',
                        onPress: async (): Promise<void> => {
                            if (!permission?.granted) {
                                if (permission?.canAskAgain) {
                                    await requestPermission();
                                } else {
                                    openSettings();
                                }
                                return;
                            }
                            setProcessing(true);
                            const result = await launchImageLibraryAsync({
                                mediaTypes: ['videos'],
                                allowsEditing: true,
                            });
                            setProcessing(false);
                            //TODO error handling via try catch
                            if (result.canceled) {
                                // Do Nothing
                            } else {
                                if (result.assets && result.assets.length > 0) {
                                    onSourceChange?.(result.assets[0].uri);
                                } else {
                                    Alert.alert('There was no video selected. Try again later.');
                                }
                                setShowPicker(false);
                            }
                        },
                    },
                    {
                        label: 'Record a New Video',
                        onPress: (): void => {
                            setShowPicker(false);
                            router.push({
                                pathname: '/(drawer)/(screens)/(submit)/record',
                                params: { swing: type },
                            });
                        },
                    },
                    { label: 'Cancel', onPress: (): void => setShowPicker(false) },
                ]}
            />
        </>
    );
};
