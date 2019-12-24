import React, { useRef, useState } from 'react';
// Components
import { StyleSheet, TouchableOpacity, ViewProperties, View } from 'react-native';
import Video from 'react-native-video';
import { Icon } from 'react-native-elements';
import { H7 } from '../';

// Styles
import { width, aspectWidth } from '../../utilities/dimensions';
import { sharedStyles } from '../../styles';
import { transparent, oledBlack, white, blackOpacity } from '../../styles/colors';
import { sizes, spaces } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';

// Utilities
import color from 'color';


const portraitWidth = (width - 3 * spaces.medium) / 2;
const portraitHeight = aspectWidth(portraitWidth);

type VideoProps = ViewProperties & {
    source: string;
    editable?: boolean;
    onEdit?: Function;
    editIcon?: JSX.Element;
};
type PlaceholderProps = ViewProperties & {
    title?: string;
    onPress?: Function;
    icon?: JSX.Element;
    editIcon?: JSX.Element;
};

export const SEVideo = (props: VideoProps) => {
    const { source, style, editable = false, onEdit = () => {} } = props;
    const vid = useRef(null);
    const [playing, setPlaying] = useState(false);

    return (
        <View style={StyleSheet.flatten([styles.portrait, { backgroundColor: oledBlack[900] }, style])}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ height: '100%', width: '100%' }}
                onPress={() => setPlaying(!playing)}>
                <Video
                    source={{ uri: source }}
                    ref={vid}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    paused={!playing}
                    onEnd={() => setPlaying(false)}
                    resizeMode="contain"
                    repeat={true}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={'ignore'}
                    style={{ height: '100%', width: '100%' }}
                />
                <View style={[styles.fullCentered, { opacity: playing ? 0 : 1 }]}>
                    <Icon name={'play-arrow'} size={sizes.large} color={white[50]} underlayColor={transparent} />
                </View>
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
                        onPress={() => onEdit()}>
                        <Icon name={'edit'} color={white[50]} underlayColor={transparent} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
};
export const SEVideoPlaceholder = (props: PlaceholderProps) => {
    const { icon, editIcon, style, onPress = () => {} } = props;
    const theme = useTheme();
    return (
        <View style={StyleSheet.flatten([styles.portrait, sharedStyles.dashed, { backgroundColor: color(theme.colors.primary[500]).fade(.85) }, style])}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ height: '100%', width: '100%', alignItems: 'center' }}
                onPress={() => onPress()}>
                <H7 font={'regular'} style={{ marginTop: spaces.medium }}>
                    {props.title}
                </H7>
                <View style={styles.fullCentered}>{icon}</View>
                <View style={[sharedStyles.centered, styles.bottomPanel]}>{editIcon}</View>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
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
        padding: spaces.medium,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100,
    },
});
