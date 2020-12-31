import React, { useState } from 'react';
import { useTheme, ActivityIndicator } from 'react-native-paper'; //'../../styles/theme';

// Components
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Subtitle } from '../';
import { YouTube } from './Youtube';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { width, aspectHeight } from '../../utilities/dimensions';
import { unit } from '../../styles/sizes';
import { black } from '../../styles/colors';

// Types
import { Theme } from '../../styles/theme';

export type VideoCardProps = {
    headerColor?: string;
    headerTitle: string;
    headerSubtitle?: string;
    headerIcon?: string;
    headerFontColor?: string;
    video?: string;
    onExpand?: Function;
}

export const VideoCard: React.FC<VideoCardProps> = (props) => {
    const { video, style, onExpand, headerIcon, headerTitle, headerSubtitle } = props;
    const theme = useTheme();
    const { headerColor = theme.colors.primary, headerFontColor = theme.colors.onPrimary } = props;
    const styles = useStyles(theme);

    const [refresh, setRefresh] = useState(0);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(Platform.OS === 'android');

    const videoWidth = width - 2 * theme.spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    return (
        <View style={[styles.card, style]}>
            <View
                style={{
                    borderRadius: theme.roundness,
                    overflow: 'hidden',
                }}
            >
                <View style={[styles.header, { backgroundColor: headerColor }]}>
                    {headerIcon && (
                        <MatIcon
                            name={headerIcon}
                            color={headerFontColor}
                            size={24}
                            style={{ marginRight: theme.spaces.medium }}
                        />
                    )}
                    <View style={{ flex: 1 }}>
                        <Subtitle style={{ color: headerFontColor }}>{headerTitle}</Subtitle>

                        {headerSubtitle ? (
                            <Subtitle style={{ color: headerFontColor }}>{headerSubtitle}</Subtitle>
                        ) : null}
                    </View>
                    {onExpand && (
                        <TouchableOpacity
                            onPress={() => {
                                setPlay(false);
                                setRefresh((refresh + 1) % 2);
                                onExpand();
                            }}
                            style={styles.actionItem}
                        >
                            <MatIcon name={'open-in-new'} color={headerFontColor} size={theme.sizes.small} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {video && (
                        <YouTube
                            videoId={video}
                            play={play}
                            onReady={() => setReady(true)}
                            style={{ opacity: ready ? 1 : 0, width: videoWidth, height: videoHeight }}
                        />
                    )}
                    {!ready && (
                        <ActivityIndicator
                            size={theme.sizes.xLarge}
                            style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        actionItem: {
            marginLeft: theme.spaces.small,
        },
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
            height: unit(52),
            paddingHorizontal: theme.spaces.medium,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
