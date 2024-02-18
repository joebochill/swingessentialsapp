import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

// Components
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { Stack, Typography } from '..';
import YoutubePlayer from 'react-native-youtube-iframe';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { width as deviceWidth, aspectHeight } from '../../utilities/dimensions';
import { useAppTheme } from '../../theme';
import { Logger } from '../../utilities/logging';

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
                    <MatIcon name={'open-in-new'} color={theme.colors.onPrimary} size={theme.size.sm} />
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
    const width = deviceWidth - 2 * theme.spacing.md;
    const { videoWidth = width, headerTitle, headerSubtitle, video, onExpand, style } = props;
    const [videoReady, setVideoReady] = useState(false);
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state: string) => {
        switch (state) {
            case 'ended':
            case 'paused':
                setPlaying(false);
                break;
            case 'playing':
                setPlaying(true);
                break;
            default:
                return;
        }
    }, []);

    return (
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
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.roundness,
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
                <View>
                    <YoutubePlayer
                        height={aspectHeight(videoWidth)}
                        width={videoWidth}
                        play={playing}
                        videoId={video}
                        onChangeState={onStateChange}
                        onReady={(): void => setVideoReady(true)}
                        onError={(e): void => {
                            void Logger.logError({
                                code: 'YTB-001',
                                description: `Youtube player encountered an error.`,
                                rawErrorCode: '000',
                                rawErrorMessage: e,
                            });
                        }}
                    />
                    {!videoReady && (
                        <ActivityIndicator
                            size={theme.size.xl}
                            style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                        />
                    )}
                </View>
            </Stack>
        </View>
    );
};
