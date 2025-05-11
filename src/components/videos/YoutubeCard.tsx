import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { width as deviceWidth, aspectHeight } from '../../utilities/dimensions';
import { useAppTheme } from '../../theme';
import { Stack } from '../layout/Stack';
import { Typography } from '../typography';
import { Icon } from '../common/Icon';
import { LOG } from '../../logger';
import { Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

type YoutubeCardHeaderProps = {
    title?: string;
    subtitle?: string;
    onExpand?: () => void;
};
export const YoutubeCardHeader: React.FC<YoutubeCardHeaderProps> = (props) => {
    const { title, subtitle, onExpand } = props;
    const theme = useAppTheme();
    return (
        <Stack
            direction={'row'}
            align={'center'}
            justify={'space-between'}
            style={[
                {
                    height: theme.size.xl,
                    paddingHorizontal: theme.spacing.md,
                    overflow: 'hidden',
                    backgroundColor: theme.colors.primary,
                },
            ]}
        >
            <Stack style={{ flex: 1 }}>
                <Typography variant={'bodyMedium'} style={{ color: theme.colors.onPrimary }}>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant={'bodyMedium'} style={{ color: theme.colors.onPrimary }}>
                        {subtitle}
                    </Typography>
                )}
            </Stack>
            {onExpand && (
                <TouchableOpacity onPress={onExpand} style={{ marginLeft: theme.spacing.sm }}>
                    <Icon name={'open-in-new'} color={theme.colors.onPrimary} size={theme.size.sm} />
                </TouchableOpacity>
            )}
        </Stack>
    );
};
export type YoutubeCardProps = {
    style?: ViewProps['style'];
    videoWidth?: number;
    headerTitle?: string;
    headerSubtitle?: string;
    video?: string;
    onExpand?: () => void;
};

export const YoutubeCard: React.FC<YoutubeCardProps> = (props) => {
    const theme = useAppTheme();
    const width = deviceWidth;
    const { videoWidth = width, headerTitle, headerSubtitle, video, onExpand, style } = props;
    const [showVideo, setShowVideo] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [playing, setPlaying] = useState(false);

    const playerRef = useRef<YoutubeIframeRef>(null);

    const showHeader = Boolean(headerTitle || headerSubtitle || onExpand);

    const onStateChange = useCallback((state: string) => {
        switch (state) {
            case 'ended':
            case 'paused':
                setPlaying(false);
                break;
            case 'playing':
                setPlaying(true);
                // setHasPlayed(true);
                break;
            default:
                return;
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Screen is unfocused, reset the video
                setPlaying(false);
                setVideoReady(false);
                setShowVideo(false);
            };
        }, [])
    );

    return (
        <>
            <View
                style={[
                    {
                        shadowColor: '#000',
                        shadowOpacity: 0.4,
                        shadowRadius: 3,
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        elevation: 1,
                        flex: 1,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.background,
                        borderRadius: theme.roundness,
                        overflow: 'hidden',
                    },
                    ...(Array.isArray(style) ? style : [style]),
                ]}
            >
                {/* outer shadow gets clipped without this inner view */}
                <Stack
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    {showHeader && (
                        <YoutubeCardHeader title={headerTitle} subtitle={headerSubtitle} onExpand={onExpand} />
                    )}
                    {!showVideo && (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setShowVideo(true);
                                setPlaying(true);
                            }}
                        >
                            <Image
                                source={{ uri: `https://img.youtube.com/vi/${video}/maxresdefault.jpg` }}
                                style={{
                                    width: videoWidth,
                                    height: aspectHeight(videoWidth),
                                }}
                                resizeMode={'contain'}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon name={'play-circle'} color={'rgba(255,255,255,0.55)'} size={theme.size.xxl} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {showVideo && (
                        <YoutubePlayer
                            ref={playerRef}
                            height={aspectHeight(videoWidth)}
                            width={videoWidth}
                            play={playing}
                            videoId={video}
                            onChangeState={onStateChange}
                            onReady={(): void => setVideoReady(true)}
                            webViewProps={{
                                androidLayerType: 'hardware',
                            }}
                            onError={(e: string): void => {
                                LOG.error(`Youtube player encountered an error: ${e}`, { zone: 'YTB' });
                            }}
                            initialPlayerParams={{
                                modestbranding: true,
                                controls: true,
                            }}
                        />
                    )}
                    {showVideo && (
                        <>
                            {!videoReady && (
                                <ActivityIndicator
                                    size={theme.size.xl}
                                    style={{
                                        position: 'absolute',
                                        top: showHeader ? theme.size.xl : 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                />
                            )}
                            {/* Main Video Body Blocker (for Scroll) */}
                            {/* <TouchableOpacity
                                onPress={() => {
                                    setPlaying((p) => !p);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: showHeader ? 2*theme.size.xl : 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 58,
                                    backgroundColor: 'rgba(255,0,0,0.35)',
                                }}
                            /> */}
                            {/* CC And Settings Button Blocker */}
                            {/* {hasPlayed && (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        if (hasPlayed) {
                                            setShowSettingsWarning(true);
                                        }
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: Platform.OS === 'ios' ? (DeviceInfo.isTablet() ? 80 : 60) : 90,
                                        right: Platform.OS === 'ios' && DeviceInfo.isTablet() ? 160 : 130,
                                        height: Platform.OS === 'ios' && DeviceInfo.isTablet() ? 35 : 40,
                                        bottom: 0,
                                        // backgroundColor: DeviceInfo.isTablet() ? 'rgba(0,255,0,0.35)' : 'rgba(0,0, 255,0.35)',
                                    }}
                                />
                            )} */}
                            {/* Airplay Settings Button Blocker */}
                            {/* {Platform.OS === 'ios' && DeviceInfo.isTablet() && hasPlayed && (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        if (hasPlayed) {
                                            setShowSettingsWarning(true);
                                        }
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: 40,
                                        right: 50,
                                        height: 35,
                                        bottom: 0,
                                        backgroundColor: 'rgba(255,0, 255,0.35)',
                                    }}
                                />
                            )} */}
                        </>
                    )}
                </Stack>
            </View>
        </>
    );
};
