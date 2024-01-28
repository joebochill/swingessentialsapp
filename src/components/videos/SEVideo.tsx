import React, { useRef, useState, useEffect } from 'react';
// Components
import { StyleSheet, TouchableOpacity, ViewProperties, View, Platform, ViewStyle } from 'react-native';
import Video from 'react-native-video';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import { width, aspectWidth } from '../../utilities/dimensions';
import { useSharedStyles, useFormStyles, useListStyles } from '../../styles';
import { transparent, blackOpacity } from '../../styles/colors';
import { useTheme, Subheading, ActivityIndicator, MD3Theme } from 'react-native-paper';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    fullCentered: ViewStyle;
    portrait: ViewStyle;
    bottomPanel: ViewStyle;
}> => {
    const portraitWidth = (width - 3 * 8/*theme.spaces.medium*/) / 2;
    const portraitHeight = aspectWidth(portraitWidth);
    return StyleSheet.create({
        fullCentered: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        portrait: {
            width: portraitWidth,
            height: portraitHeight,
        },
        bottomPanel: {
            backgroundColor: transparent,
            // padding: theme.spaces.medium,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 100,
        },
    });
};

type VideoProps = ViewProperties & {
    source: string;
    editable?: boolean;
    onEdit?: () => void;
    editIcon?: JSX.Element;
};
type PlaceholderProps = ViewProperties & {
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
    const theme = useTheme();
    const styles = useStyles(theme);
    const sharedStyles = useSharedStyles(theme);

    useEffect((): void => {
        // TODO: This was added after the iOS release
        setReady(false);
    }, [source, setReady]);

    return (
        <View style={[styles.portrait, /*{ backgroundColor: theme.colors.light },*/ style]}>
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
                    // onReadyForDisplay={() => setReady(true } TODO: this was changed after iOS release
                    resizeMode="contain"
                    repeat={Platform.OS === 'ios'}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={'ignore'}
                    style={{ height: '100%', width: '100%' }}
                />
                {!ready && (
                    <ActivityIndicator
                        // size={theme.sizes.xLarge}
                        color={theme.colors.onPrimary}
                        style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                    />
                )}
                {ready && (
                    <View style={[styles.fullCentered, { opacity: playing ? 0 : 1 }]}>
                        <MatIcon
                            name={'play-arrow'}
                            // size={theme.sizes.large}
                            color={theme.colors.onPrimary}
                            // underlayColor={transparent}
                        />
                    </View>
                )}
                {editable && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            sharedStyles.centered,
                            styles.bottomPanel,
                            {
                                backgroundColor: blackOpacity(0.2),
                            },
                        ]}
                        onPress={onEdit}
                    >
                        <MatIcon
                            name={'edit'}
                            // size={theme.sizes.small}
                            color={theme.colors.onPrimary}
                            // underlayColor={transparent}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
};
export const SEVideoPlaceholder: React.FC<PlaceholderProps> = (props) => {
    const { icon, editIcon, style, disabled, onPress = (): void => {} } = props;
    const theme = useTheme();
    const styles = useStyles(theme);
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    const listStyles = useListStyles(theme);

    return (
        <View style={[styles.portrait, formStyles.dashed, style]}>
            <TouchableOpacity
                disabled={disabled}
                activeOpacity={0.8}
                style={{ height: '100%', width: '100%', alignItems: 'center' }}
                onPress={onPress}
            >
                <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                    <Subheading style={[listStyles.heading, /*{ marginVertical: theme.spaces.medium }*/]}>
                        {props.title}
                    </Subheading>
                </View>
                <View style={styles.fullCentered}>{icon}</View>
                <View style={[sharedStyles.centered, styles.bottomPanel]}>{editIcon}</View>
            </TouchableOpacity>
        </View>
    );
};
