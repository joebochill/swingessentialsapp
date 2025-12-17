import { Icon } from '@/components/common/Icon';
import { Stack } from '@/components/layout/Stack';
import { Typography } from '@/components/typography/Typography';
import { LOG } from '@/logger';
import { useAppTheme } from '@/theme';
import { aspectHeight, width as deviceWidth } from '@/utilities/dimensions';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';

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
                <Pressable
                    onPress={onExpand}
                    style={({ pressed }) => ({
                        marginLeft: theme.spacing.sm,
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Icon name={'open-in-new'} color={theme.colors.onPrimary} size={theme.size.sm} />
                </Pressable>
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
    const [videoReady, setVideoReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(`https://img.youtube.com/vi/${video}/maxresdefault.jpg`);

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
                setThumbnailUrl(`https://img.youtube.com/vi/${video}/maxresdefault.jpg`);
            };
        }, [video])
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
                <Stack
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    {showHeader && (
                        <YoutubeCardHeader title={headerTitle} subtitle={headerSubtitle} onExpand={onExpand} />
                    )}
                    <View style={{ position: 'relative' }}>
                        {!videoReady && (
                            <View style={StyleSheet.absoluteFill}>
                                <Image
                                    source={{ uri: thumbnailUrl }}
                                    style={{
                                        width: videoWidth,
                                        height: aspectHeight(videoWidth),
                                    }}
                                    resizeMode={'contain'}
                                    onError={() => setThumbnailUrl(`https://img.youtube.com/vi/${video}/hqdefault.jpg`)}
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
                                    <ActivityIndicator size={theme.size.md} color={'#ffffff'} />
                                </View>
                            </View>
                        )}

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
                                LOG.error(`Youtube player encountered an error: ${e}`, {
                                    zone: 'YTB',
                                });
                            }}
                            initialPlayerParams={{
                                modestbranding: true,
                                controls: true,
                            }}
                        />
                    </View>
                </Stack>
            </View>
        </>
    );
};
