import React, { useRef, useState, useCallback } from 'react';
// Components
import {
    TouchableOpacity,
    Platform,
    ImageSourcePropType,
    TouchableOpacityProps,
    ImageBackground,
    Alert,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';

// Styles
import { width as deviceWidth, aspectWidth } from '../../utilities/dimensions';
import { ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { Icon, IconProps, SectionHeader } from '..';
import { PickerModal } from '../PickerModal';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { ROUTES } from '../../constants/routes';

import dtl from '../../images/down-the-line.png';
import fo from '../../images/face-on.png';

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
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: theme.spacing.md }}
            imageStyle={{
                height: '100%',
                width: '100%',
                resizeMode: 'contain',
            }}
            resizeMethod={'resize'}
            source={backgroundImage ?? (type === 'fo' ? fo : type === 'dtl' ? dtl : undefined)}
        >
            <SectionHeader title={title ?? type === 'fo' ? 'Face-On' : type === 'dtl' ? 'Down-the-Line' : ''} />
            {editIcon && <Icon {...editIcon} />}
        </ImageBackground>
    );
};
type SwingVideoProps = Omit<TouchableOpacityProps, 'onPress'> & {
    type: 'fo' | 'dtl';
    navigation?: StackNavigationProp<RootStackParamList>;
    width?: number;
    height?: number;
    source?: VideoProperties['source'];
    onSourceChange?: (source: Asset) => void;
    editable?: boolean;
    loading?: boolean;
    PlaceholderProps?: Partial<SwingVideoPlaceholderProps>;
};

export const SwingVideo: React.FC<SwingVideoProps> = (props) => {
    const theme = useAppTheme();
    // Play Video
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    // Choose Video
    const [showPicker, setShowPicker] = useState(false);
    // Video loading
    const [processing, setProcessing] = useState(false);

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
        navigation,
        ...other
    } = props;
    const placeholderProps = {
        type,
        editIcon: {
            name: 'add-a-photo',
            color: theme.colors.onPrimaryContainer,
            size: theme.size.md,
        },
        ...PlaceholderProps,
    };

    const handlePress = useCallback(() => {
        if (source && videoReady) {
            setVideoPlaying((p) => !p);
        } else if (!source) {
            setShowPicker(true);
        }
    }, [source, videoReady]);

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    {
                        width,
                        height,
                        borderRadius: theme.roundness,
                        overflow: 'hidden',
                    },
                    source
                        ? {
                              backgroundColor: theme.colors.primaryContainer,
                          }
                        : {
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderColor: theme.colors.primary,
                              backgroundColor: theme.colors.surface,
                          },
                    ...(Array.isArray(style) ? style : [style]),
                ]}
                onPress={handlePress}
                {...other}
            >
                {!source ? (
                    <SwingVideoPlaceholder {...placeholderProps} />
                ) : (
                    <Video
                        source={source}
                        ref={videoRef}
                        rate={1.0}
                        volume={1.0}
                        muted={false}
                        paused={!videoPlaying}
                        onLoad={(): void => {
                            // TODO: this was added for Android after iOS release
                            setVideoReady(true);
                            // @ts-ignore
                            if (videoRef.current && Platform.OS === 'android') vid.current.seek(0);
                        }}
                        onEnd={(): void => setVideoPlaying(false)}
                        onReadyForDisplay={() => setVideoReady(true)} //TODO: this was changed after iOS release
                        resizeMode="contain"
                        repeat={Platform.OS === 'ios'}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={'ignore'}
                        style={{ height: '100%', width: '100%', backgroundColor: theme.colors.primaryContainer }}
                    />
                )}
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
                            // backgroundColor: 'rgba(255,255,255,0.75)',
                        }}
                    />
                )}
                {videoReady && !loading && !processing && (
                    <Icon
                        name={'play-arrow'}
                        size={theme.size.xl}
                        color={theme.colors.onPrimary}
                        style={{
                            height: '100%',
                            width: '100%',
                            textAlign: 'center',
                            lineHeight: height,
                            position: 'absolute',
                            opacity: videoPlaying ? 0 : 1,
                        }}
                    />
                )}
                {source && !videoPlaying && editable && !processing && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            {
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                left: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: theme.spacing.md,
                            },
                        ]}
                        onPress={(): void => setShowPicker(true)}
                    >
                        <Icon name={'edit'} size={theme.size.md} color={theme.colors.onPrimary} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
            <PickerModal
                isVisible={showPicker}
                onBackdropPress={processing ? undefined : (): void => setShowPicker(false)}
                style={{ opacity: processing ? 0 : 1 }}
                backdropOpacity={processing ? 0 : undefined}
                menuOptions={[
                    {
                        label: 'Choose From Library',
                        onPress: async (): Promise<void> => {
                            setProcessing(true);
                            const result = await launchImageLibrary({
                                mediaType: 'video',
                                videoQuality: 'high',
                                formatAsMp4: true,
                            });
                            setProcessing(false);
                            if (result.didCancel) {
                                /*do nothing*/
                            } else if (result.errorCode) {
                                Alert.alert(
                                    `There was an error choosing a video. Try again later. ${result.errorMessage}`
                                );
                                setShowPicker(false);
                            } else {
                                if (result.assets && result.assets.length > 0) {
                                    void onSourceChange?.(result.assets[0]);
                                } else {
                                    Alert.alert(`There was no video selected. Try again later.`);
                                }
                                setShowPicker(false);
                            }
                        },
                    },
                    {
                        label: 'Record a New Video',
                        onPress: (): void => {
                            setShowPicker(false);
                            // @ts-ignore
                            navigation?.push(ROUTES.RECORD, {
                                swing: type,
                                onReturn: (uri: string) => {
                                    void onSourceChange?.({ uri });
                                },
                            });
                        },
                    },
                    { label: 'Cancel', onPress: (): void => setShowPicker(false) },
                ]}
            />
        </>
    );
};
