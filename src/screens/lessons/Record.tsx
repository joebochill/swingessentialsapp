import React, { useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// Components
import {
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { VideoControls, CountDown, VideoTimer } from '../../components';
import Video from 'react-native-video';

// Styles
import { useSharedStyles } from '../../styles';
import { oledBlack, blackOpacity } from '../../styles/colors';

// Utilities
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Types
import { HandednessType, SwingType, CameraType, ApplicationState } from '../../__types__';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Overlay images
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';
import { ROUTES } from '../../constants/routes';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { Logger } from '../../utilities/logging';
import { MD3Theme, useTheme } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

// const DESIRED_RATIO = '16:9';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    bar: StyleProp<ViewStyle>;
    content: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        bar: {
            width: '100%',
            top: 0,
            left: 0,
            paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
            position: 'absolute',
            justifyContent: 'flex-end',
            zIndex: 1000,
            backgroundColor: blackOpacity(0.5),
        },
        content: {
            flex: 1,
            position: 'relative',
            // paddingHorizontal: theme.spaces.medium,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

const getOverlayImage = (swing: SwingType, handedness: HandednessType, camera: CameraType): ImageSourcePropType => {
    const options: ImageSourcePropType[] = swing === 'dtl' ? [downthelineRH, downthelineLH] : [faceonRH, faceonLH];
    let index = 0;

    if ((handedness === 'left' && camera === 'back') || (handedness === 'right' && camera === 'front')) {
        index = 1;
    }
    return options[index];
};

export const Record: React.FC<StackScreenProps<RootStackParamList, 'Record'>> = (props) => {
    const { navigation } = props;
    const cameraRef = useRef(null);
    const videoRef = useRef(null);
    const theme = useTheme();
    const styles = useStyles(theme);
    const sharedStyles = useSharedStyles(theme);
    const { onReturn, swing } = props.route.params;

    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);

    const cameras: CameraType[] = ['back', 'front'];
    const [cameraType, setCameraType] = useState(0);
    // const [cameraRatios, setCameraRatios] = useState([]);

    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setCountdownStarted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');

    const startRecording = useCallback(async () => {
        setCountdownStarted(false);

        if (!cameraRef || !cameraRef.current) {
            void Logger.logError({
                code: 'REC100',
                description: 'No camera object was found.',
            });
            return;
        }
        const options = {
            maxFileSize: 9.5 * 1024 * 1024,
            maxDuration: settings.duration,
            orientation: 'portrait',
            quality: RNCamera.Constants.VideoQuality['720p'],
        };

        try {
            // @ts-ignore
            const videoResult = await cameraRef.current.recordAsync(options);

            setRecordedVideo(videoResult.uri);
            setIsRecording(false);
            setRecordingMode(false);
        } catch (error: any) {
            void Logger.logError({
                code: 'REC150',
                description: 'Async Video Recording failed.',
                rawErrorCode: error.code,
                rawErrorMessage: error.message,
            });
        }
    }, [cameraRef, settings]);

    const endRecording = useCallback(() => {
        setCountdownStarted(false);
        if (!cameraRef || !cameraRef.current) {
            void Logger.logError({
                code: 'REC200',
                description: 'No camera object was found.',
            });
            return;
        }
        if (isRecording) {
            // @ts-ignore
            cameraRef.current.stopRecording();
        }

        setRecordedVideo('');
        setIsRecording(false);
    }, [isRecording]);

    // This effect causing a null object reference in Android
    // useEffect(() => {
    //     if (Platform.OS === 'android' && cameraRef && cameraRef.current) {
    //         const getAvailableRatios = async () => {
    //             const ratios = await cameraRef.current.getSupportedRatiosAsync();
    //             setCameraRatios(ratios);
    //         };
    //         getAvailableRatios();
    //     }
    // }, [cameraRef, cameraRef.current]);

    const VideoRecorder = (
        <RNCamera
            ref={cameraRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            type={RNCamera.Constants.Type[cameras[cameraType]]}
            // onCameraReady={() => setRecordingMode(true)}
            flashMode={showCountDown ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            // ratio={cameraRatios.find(ratio => ratio === DESIRED_RATIO) || cameraRatios[cameraRatios.length - 1]}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
    );
    const VideoPlayer = (
        <Video
            ref={videoRef}
            source={{ uri: recordedVideo }}
            rate={1.0}
            volume={1.0}
            muted={false}
            paused={!isPlaying}
            onEnd={(): void => setIsPlaying(false)}
            onLoad={(): void => {
                // TODO: this was added for Android after iOS release
                setPreviewReady(true);
                // @ts-ignore
                if (videoRef.current && Platform.OS === 'android') videoRef.current.seek(0);
            }}
            resizeMode="contain"
            repeat={Platform.OS === 'ios'}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch={'ignore'}
            style={{ height: '100%', width: '100%' }}
        />
    );
    return (
        <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: oledBlack[900] }}>
            {recordingMode && VideoRecorder}
            {!recordingMode && VideoPlayer}
            {!recordingMode &&
                !previewReady && ( // TODO: this was added after the iOS release
                    <ActivityIndicator
                        // size={theme.sizes.xLarge}
                        color={theme.colors.onPrimary}
                        style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                    />
                )}
            {recordingMode && settings.overlay && (
                <View style={[sharedStyles.absoluteFull, sharedStyles.centered]}>
                    <Image
                        resizeMethod="resize"
                        style={{ height: '100%', width: '100%', opacity: 0.35, resizeMode: 'contain' }}
                        source={getOverlayImage(swing, settings.handedness, cameras[cameraType])}
                    />
                </View>
            )}
            {recordingMode && (
                <View style={styles.bar}>
                    <StatusBar barStyle={'light-content'} />
                    <SafeAreaView style={{ height: HEADER_COLLAPSED_HEIGHT }}>
                        <View style={styles.content}>
                            {recordingMode && !isRecording && <View style={{ flex: 1 }} />}
                            {isRecording && !showCountDown && <VideoTimer visible={isRecording} />}
                            {recordingMode && !isRecording && token && (
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    {/* @ts-ignore */}
                                    <TouchableOpacity onPress={(): void => navigation.push(ROUTES.SETTINGS_GROUP)}>
                                        <MatIcon
                                            name={'settings'}
                                            // size={theme.sizes.small}
                                            color={theme.colors.onPrimary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            )}
            {/* @ts-ignore */}
            {showCountDown && <CountDown startValue={settings.delay} onFinish={(): void => startRecording()} />}
            <VideoControls
                mode={recordingMode ? 'record' : 'play'}
                active={isRecording || isPlaying}
                onAction={
                    recordingMode
                        ? (): void => {
                              // Start / End recording
                              if (!isRecording) {
                                  setCountdownStarted(true);
                                  setIsRecording(true);
                              } else {
                                  endRecording();
                              }
                          }
                        : (): void => {
                              // Play / Pause the video
                              setIsPlaying(!isPlaying);
                          }
                }
                onBack={
                    recordingMode
                        ? (): void => props.navigation.pop() // Go Back
                        : (): void => {
                              setRecordingMode(true);
                              setRecordedVideo('');
                          }
                }
                onNext={
                    recordingMode
                        ? (): void => {
                              // Toggle Camera
                              setCameraType((cameraType + 1) % cameras.length);
                          }
                        : (): void => {
                              // Use-Video
                              // @ts-ignore
                              onReturn(recordedVideo);
                              setPreviewReady(false);
                              props.navigation.pop();
                          }
                }
            />
        </View>
    );
};
