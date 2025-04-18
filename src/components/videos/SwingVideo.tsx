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
import Video, { ReactVideoSourceProperties } from 'react-native-video';

// Styles
import { width as deviceWidth, aspectWidth } from '../../utilities/dimensions';
import { ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { PickerModal } from '../inputs/PickerModal';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { ROUTES } from '../../navigation/routeConfig';

import dtl from '../../assets/images/down-the-line.png';
import fo from '../../assets/images/face-on.png';
import dtlDark from '../../assets/images/down-the-line-dark.png';
import foDark from '../../assets/images/face-on-dark.png';
import { Icon, IconProps } from '../common/Icon';
import { SectionHeader } from '../typography/SectionHeader';
import { RootStackParamList } from '../../navigation/MainNavigation';

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
            source={
                backgroundImage ??
                (type === 'fo' ? (theme.dark ? foDark : fo) : type === 'dtl' ? (theme.dark ? dtlDark : dtl) : undefined)
            }
        >
            <SectionHeader title={title ?? type === 'fo' ? 'Face-On' : type === 'dtl' ? 'Down-the-Line' : ''} />
            {editIcon && <Icon color={'onPrimary'} {...editIcon} />}
        </ImageBackground>
    );
};
type SwingVideoProps = Omit<TouchableOpacityProps, 'onPress'> & {
    type: 'fo' | 'dtl';
    navigation?: StackNavigationProp<RootStackParamList>;
    width?: number;
    height?: number;
    source?: ReactVideoSourceProperties;
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
            color: theme.dark ? theme.colors.onPrimary : theme.colors.onPrimaryContainer,
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
                              backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                          }
                        : {
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderColor: theme.colors.outline,
                              backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                          },
                    ...(Array.isArray(style) ? style : [style]),
                ]}
                onPress={handlePress}
                {...other}
            >
                {!source ? (
                    !processing && <SwingVideoPlaceholder {...(placeholderProps as any)} />
                ) : (
                    <Video
                        source={source}
                        ref={videoRef}
                        rate={1.0}
                        volume={1.0}
                        muted={false}
                        paused={!videoPlaying}
                        onLoad={(): void => {
                            setVideoReady(true);
                            if (videoRef.current && Platform.OS === 'android') {
                                // @ts-expect-error we know seek exists even though the ref is incorrectly typed
                                videoRef.current.seek(0);
                            }
                        }}
                        onEnd={(): void => setVideoPlaying(false)}
                        onReadyForDisplay={() => setVideoReady(true)}
                        resizeMode="contain"
                        repeat={Platform.OS === 'ios'}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={'ignore'}
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                        }}
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
                                    onSourceChange?.(result.assets[0]);
                                } else {
                                    Alert.alert('There was no video selected. Try again later.');
                                }
                                setShowPicker(false);
                            }
                        },
                    },
                    {
                        label: 'Record a New Video',
                        onPress: (): void => {
                            setShowPicker(false);
                            navigation?.push(ROUTES.RECORD, {
                                swing: type,
                                onReturn: (uri: string) => {
                                    onSourceChange?.({ uri });
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
