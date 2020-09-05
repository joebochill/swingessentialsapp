import React, { useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// Components
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { VideoControls, CountDown, VideoTimer } from '../../components';
import Video from 'react-native-video';

// Styles
import { useSharedStyles } from '../../styles';
import { oledBlack, blackOpacity, white } from '../../styles/colors';
import { spaces } from '../../styles/sizes';

// Utilities
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Types
import { HandednessType, SwingType, CameraType } from '../../__types__';
import { ApplicationState } from '../../__types__';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Overlay images
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';
import { ROUTES } from '../../constants/routes';
import { Icon } from 'react-native-elements';
import { Logger } from '../../utilities/logging';
import { useTheme } from 'react-native-paper';

// const DESIRED_RATIO = '16:9';

const getOverlayImage = (swing: SwingType, handedness: HandednessType, camera: CameraType) => {
    let options = swing === 'dtl' ? [downthelineRH, downthelineLH] : [faceonRH, faceonLH];
    let index = 0;

    if ((handedness === 'left' && camera === 'back') || (handedness === 'right' && camera === 'front')) {
        index = 1;
    }
    return options[index];
};

export const Record = props => {
    const { navigation } = props;
    const cameraRef = useRef(null);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const onReturn = props.navigation.getParam('onReturn', () => {});
    const swing: SwingType = props.navigation.getParam('swing', () => {});

    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);

    const cameras: CameraType[] = ['back', 'front'];
    const [cameraType, setCameraType] = useState(0);
    // const [cameraRatios, setCameraRatios] = useState([]);

    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setCountdownStarted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');

    const _startRecording = useCallback(async () => {
        setCountdownStarted(false);

        if (!cameraRef || !cameraRef.current) {
            Logger.logError({
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
            const _video = await cameraRef.current.recordAsync(options);

            setRecordedVideo(_video.uri);
            setIsRecording(false);
            setRecordingMode(false);
        } catch (error) {
            Logger.logError({
                code: 'REC150',
                description: 'Async Video Recording failed.',
                rawErrorCode: error.code,
                rawErrorMessage: error.message,
            });
        }
    }, [cameraRef, settings]);

    const _endRecording = useCallback(() => {
        setCountdownStarted(false);
        if (!cameraRef || !cameraRef.current) {
            Logger.logError({
                code: 'REC200',
                description: 'No camera object was found.',
            });
            return;
        }
        if (isRecording) {
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
                backgroundColor: 'orange',
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
            source={{ uri: recordedVideo }}
            rate={1.0}
            volume={1.0}
            muted={false}
            paused={!isPlaying}
            onEnd={() => setIsPlaying(false)}
            resizeMode="contain"
            repeat={false} // TODO: changed since ios release
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
                                    <TouchableOpacity onPress={(): void => navigation.push(ROUTES.SETTINGS_GROUP)}>
                                        <Icon name={'settings'} color={white[50]} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            )}
            {showCountDown && <CountDown startValue={settings.delay} onFinish={() => _startRecording()} />}
            <VideoControls
                mode={recordingMode ? 'record' : 'play'}
                active={isRecording || isPlaying}
                onAction={
                    recordingMode
                        ? () => {
                              // Start / End recording
                              if (!isRecording) {
                                  setCountdownStarted(true);
                                  setIsRecording(true);
                              } else {
                                  _endRecording();
                              }
                          }
                        : () => {
                              // Play / Pause the video
                              setIsPlaying(!isPlaying);
                          }
                }
                onBack={
                    recordingMode
                        ? () => props.navigation.pop() // Go Back
                        : () => {
                              setRecordingMode(true);
                              setRecordedVideo('');
                          }
                }
                onNext={
                    recordingMode
                        ? () => {
                              // Toggle Camera
                              setCameraType((cameraType + 1) % cameras.length);
                          }
                        : () => {
                              // Use-Video
                              onReturn(recordedVideo);
                              props.navigation.pop();
                          }
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
        paddingHorizontal: spaces.medium,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
