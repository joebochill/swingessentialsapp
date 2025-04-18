import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import { View, TouchableOpacity, ViewProps, Platform } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import Modal from 'react-native-modal';
import { width as deviceWidth, aspectHeight } from '../../utilities/dimensions';
import { useAppTheme } from '../../theme';
import { Stack } from '../layout/Stack';
import { Paragraph, Typography } from '../typography';
import { Icon } from '../common/Icon';
import { LOG } from '../../logger';

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
    const [videoReady, setVideoReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [showSettingsWarning, setShowSettingsWarning] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);

    const playerRef = useRef<YoutubeIframeRef>(null);

    const onStateChange = useCallback((state: string) => {
        switch (state) {
            case 'ended':
            case 'paused':
                setPlaying(false);
                break;
            case 'playing':
                setPlaying(true);
                setHasPlayed(true);
                break;
            default:
                return;
        }
    }, []);

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
                        borderRadius: theme.roundness,
                        overflow: 'hidden',
                    }}
                >
                    {(headerTitle || headerSubtitle || onExpand) && (
                        <YoutubeCardHeader title={headerTitle} subtitle={headerSubtitle} onExpand={onExpand} />
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
                            LOG.error(`Youtube player encountered an error: ${e}`, { zone: 'YTB' });
                        }}
                        initialPlayerParams={{
                            modestbranding: true,
                            controls: true,
                        }}
                    />
                    {!videoReady && (
                        <ActivityIndicator
                            size={theme.size.xl}
                            style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                        />
                    )}
                    {/* Main Video Body Blocker (for Scroll) */}
                    <TouchableOpacity
                        onPress={() => {
                            setPlaying((p) => !p);
                        }}
                        style={{
                            position: 'absolute',
                            top: theme.size.xl,
                            left: 0,
                            right: 0,
                            bottom: 58,
                            // backgroundColor: 'rgba(255,0,0,0.35)',
                        }}
                    />
                    {/* CC And Settings Button Blocker */}
                    {hasPlayed && (
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
                    )}
                    {/* Airplay Settings Button Blocker */}
                    {Platform.OS === 'ios' && DeviceInfo.isTablet() && hasPlayed && (
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
                                // backgroundColor: 'rgba(255,0, 255,0.35)',
                            }}
                        />
                    )}
                </Stack>
            </View>
            <Modal
                animationIn="slideInUp"
                animationOut={'slideOutDown'}
                backdropColor={'rgba(0,0,0,0.35)'}
                onBackdropPress={(): void => {
                    setShowSettingsWarning(false);
                }}
                onDismiss={(): void => {
                    setShowSettingsWarning(false);
                }}
                isVisible={showSettingsWarning}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={async () => {
                        setShowSettingsWarning(false);
                    }}
                    style={[
                        {
                            borderRadius: theme.roundness,
                            backgroundColor: theme.colors.surface,
                            padding: theme.spacing.lg,
                        },
                    ]}
                >
                    <Paragraph style={{ color: theme.colors.onSurface, textAlign: 'center' }}>
                        To change video playback settings, open in full-screen mode.
                    </Paragraph>
                </TouchableOpacity>
            </Modal>
        </>
    );
};
