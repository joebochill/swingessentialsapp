import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native-paper'; //'../../styles/theme';

// Components
import { View, StyleSheet, TouchableOpacity, Platform, StyleProp, ViewStyle } from 'react-native';
import { Stack, Typography } from '../';
import { YouTube } from './Youtube';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { width, aspectHeight } from '../../utilities/dimensions';
import { black } from '../../styles/colors';
import { AppTheme, useAppTheme } from '../../styles/theme';

// Types
// import { Theme } from '../../styles/theme';

const useStyles = (
    theme: AppTheme
): StyleSheet.NamedStyles<{
    actionItem: StyleProp<ViewStyle>;
    card: StyleProp<ViewStyle>;
    header: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        card: {
            shadowColor: black[900],
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
        header: {
            height: theme.size.xl,
            paddingHorizontal: theme.spacing.md,
            overflow: 'hidden',
        },
        actionItem: {
            marginLeft: theme.spacing.xs,
        },
    });

export type VideoCardProps = {
    headerColor?: string;
    headerTitle: string;
    headerSubtitle?: string;
    // headerIcon?: string;
    headerFontColor?: string;
    video?: string;
    onExpand?: () => void;
};

export const VideoCard: React.FC<VideoCardProps> = (props) => {
    const { video, onExpand, headerTitle, headerSubtitle } = props;
    const theme = useAppTheme();
    const { headerColor = theme.colors.primary, headerFontColor = theme.colors.onPrimary } = props;
    const styles = useStyles(theme);

    const [refresh, setRefresh] = useState(0);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(Platform.OS === 'android');

    const videoWidth = width - 2 * theme.spacing.md;
    const videoHeight = aspectHeight(videoWidth);

    return (
        <View style={[styles.card]}>
            {/* outer shadow gets clipped without this inner view */}
            <Stack
                style={{
                    borderRadius: theme.roundness,
                    overflow: 'hidden',
                }}
            >
                <Stack
                    direction={'row'}
                    align={'center'}
                    justify={'space-between'}
                    style={[styles.header, { backgroundColor: headerColor }]}
                >
                    <Stack style={{ flex: 1 }}>
                        <Typography variant={'bodyMedium'} style={{ color: headerFontColor }}>
                            {headerTitle}
                        </Typography>

                        {headerSubtitle && (
                            <Typography variant={'bodyMedium'} style={{ color: headerFontColor }}>
                                {headerSubtitle}
                            </Typography>
                        )}
                    </Stack>
                    {onExpand && (
                        <TouchableOpacity
                            onPress={(): void => {
                                setPlay(false);
                                setRefresh((refresh + 1) % 2);
                                onExpand();
                            }}
                            style={styles.actionItem}
                        >
                            <MatIcon name={'open-in-new'} color={headerFontColor} size={theme.size.sm} />
                        </TouchableOpacity>
                    )}
                </Stack>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {video && (
                        <YouTube
                            videoId={video}
                            play={play}
                            // @ts-ignore
                            onReady={(): void => setReady(true)}
                            style={{ opacity: ready ? 1 : 0, width: videoWidth, height: videoHeight }}
                        />
                    )}
                    {!ready && (
                        <ActivityIndicator
                            // size={theme.sizes.xLarge}
                            style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                        />
                    )}
                </View>
            </Stack>
        </View>
    );
};
