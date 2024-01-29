import React, { useRef, useState, useEffect } from 'react';
// Components
import { StyleSheet, TouchableOpacity, View, Platform, ViewStyle, ViewProps } from 'react-native';
import Video from 'react-native-video';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import { width, aspectWidth } from '../../utilities/dimensions';
import { ActivityIndicator } from 'react-native-paper';
import { AppTheme, useAppTheme } from '../../theme';
import { SectionHeader } from '..';

const useStyles = (
    theme: AppTheme
): StyleSheet.NamedStyles<{
    fullCentered: ViewStyle;
    bottomPanel: ViewStyle;
}> =>
    StyleSheet.create({
        fullCentered: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomPanel: {
            backgroundColor: 'transparent',
            padding: theme.spacing.md,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 100,
        },
    });

type VideoProps = ViewProps & {
    source: string;
    editable?: boolean;
    onEdit?: () => void;
    editIcon?: JSX.Element;
};
type PlaceholderProps = ViewProps & {
    title?: string;
    disabled?: boolean;
    onPress?: () => void;
    icon?: JSX.Element;
    editIcon?: JSX.Element;
};

export const SEVideo: React.FC<VideoProps> = (props) => {
    const { source, style, editable = false, onEdit = (): void => {} } = props;
    const vid = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const theme = useAppTheme();
    const styles = useStyles(theme);
    const portraitWidth = (width - 3 * theme.spacing.md) / 2;
    const portraitHeight = aspectWidth(portraitWidth);

    // TODO: Fix video playing for iOS
    useEffect((): void => {
        // TODO: This was added after the iOS release
        setReady(false);
    }, [source, setReady]);

    return (
        <View
            style={[
                { width: portraitWidth, height: portraitHeight, backgroundColor: theme.colors.primaryContainer },
                style,
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ height: '100%', width: '100%' }}
                onPress={(): void => setPlaying(!playing)}
            >
                <Video
                    source={{ uri: source }}
                    ref={vid}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    paused={!playing}
                    onLoad={(): void => {
                        // TODO: this was added for Android after iOS release
                        setReady(true);
                        // @ts-ignore
                        if (vid.current && Platform.OS === 'android') vid.current.seek(0);
                    }}
                    onEnd={(): void => setPlaying(false)}
                    onReadyForDisplay={() => setReady(true)} //TODO: this was changed after iOS release
                    resizeMode="contain"
                    repeat={Platform.OS === 'ios'}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={'ignore'}
                    style={{ height: '100%', width: '100%' }}
                />
                {!ready && (
                    <ActivityIndicator
                        size={theme.size.xl}
                        color={theme.colors.onPrimary}
                        style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                    />
                )}
                {ready && (
                    <View style={[styles.fullCentered, { opacity: playing ? 0 : 1 }]}>
                        <MatIcon name={'play-arrow'} size={theme.size.xl} color={theme.colors.onPrimary} />
                    </View>
                )}
                {editable && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
                            styles.bottomPanel,
                        ]}
                        onPress={onEdit}
                    >
                        <MatIcon name={'edit'} size={theme.size.md} color={theme.colors.onPrimary} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
};
export const SEVideoPlaceholder: React.FC<PlaceholderProps> = (props) => {
    const { icon, editIcon, style, disabled, onPress = (): void => {} } = props;
    const theme = useAppTheme();
    const styles = useStyles(theme);
    const portraitWidth = (width - 3 * theme.spacing.md) / 2;
    const portraitHeight = aspectWidth(portraitWidth);

    return (
        <View
            style={[
                {
                    width: portraitWidth,
                    height: portraitHeight,
                    borderWidth: 1,
                    borderRadius: theme.roundness,
                    borderStyle: 'dashed',
                    borderColor: theme.colors.onBackground,
                    backgroundColor: theme.colors.surface,
                },
                style,
            ]}
        >
            <TouchableOpacity
                disabled={disabled}
                activeOpacity={0.8}
                style={{ height: '100%', width: '100%', alignItems: 'center' }}
                onPress={onPress}
            >
                <SectionHeader title={props.title || ''} />

                <View style={styles.fullCentered}>{icon}</View>
                <View style={[{ alignItems: 'center', justifyContent: 'center' }, styles.bottomPanel]}>{editIcon}</View>
            </TouchableOpacity>
        </View>
    );
};
