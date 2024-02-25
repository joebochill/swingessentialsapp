import React, { useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// Components
import {
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ImageSourcePropType,
} from 'react-native';
import { VideoControls, CountDown, VideoTimer, Stack } from '../../components';
import Video from 'react-native-video';

// Types
import { HandednessType, SwingType, CameraType, ApplicationState } from '../../__types__';

// Overlay images
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';
import { ROUTES } from '../../constants/routes';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { Logger } from '../../utilities/logging';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import {
    Camera,
    CameraDevice,
    useCameraDevice,
    /*useCameraDevices,*/ useCameraFormat,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const DESIRED_RATIO = '16:9';

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
    // const cameraRef = useRef(null);
    const videoRef = useRef(null);
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const { onReturn, swing } = props.route.params;
    const backCamera = useCameraDevice('back');
    const frontCamera = useCameraDevice('front');
    const isScreenFocused = useIsFocused();
    const appState = useAppState();
    const isActive = isScreenFocused && appState === 'active';
    const camera = useRef<Camera>(null);
    const cameraDevices = [backCamera, frontCamera];
    const [cameraInitialized, setCameraInitialized] = useState(false);
    const [activeCameraIndex, setActiveCameraIndex] = useState(0);
    const currentCameraDevice = cameraDevices[activeCameraIndex] as CameraDevice;
    const cameraFormat = useCameraFormat(currentCameraDevice, [
        { videoAspectRatio: 16 / 9 },
        { videoResolution: { width: 1280, height: 720 } },
        { fps: 60 },
    ]);

    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);

    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setShowCountDown] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');

    const endRecording = useCallback(async () => {
        setShowCountDown(false); // hide the countdown timer (if you stop before recording started)

        if (!camera || !camera.current) {
            void Logger.logError({
                code: 'REC200',
                description: 'No camera object was found.',
            });
            return;
        }
        if (isRecording) {
            await camera?.current?.stopRecording();
            setIsRecording(false);
        }
        setIsRecording(false);
    }, [isRecording, camera]);

    const startRecording = useCallback(() => {
        setShowCountDown(false);
        if (!camera || !camera.current || !cameraInitialized) {
            void Logger.logError({
                code: 'REC100',
                description: 'No camera object was found/initialized.',
            });
            setIsRecording(false);
            return;
        }
        camera.current.startRecording({
            fileType: 'mp4',
            videoCodec: 'h264',
            onRecordingFinished: (video) => {
                setRecordedVideo(`${video.path}`);
                setRecordingMode(false);
            },
            onRecordingError: (error) => {
                setRecordedVideo('');
                void Logger.logError({
                    code: 'REC200',
                    description: `Recording error: ${error.message}`,
                });
            },
        });
        setTimeout(() => {
            void endRecording();
        }, settings.duration * 1000);
    }, [camera, settings, cameraInitialized, endRecording]);

    const VideoRecorder = cameraDevices[activeCameraIndex] && (
        <Camera
            ref={camera}
            device={currentCameraDevice}
            format={cameraFormat}
            video={true}
            isActive={isActive}
            audio={false}
            torch={currentCameraDevice.hasTorch && showCountDown ? 'on' : 'off'}
            onInitialized={(): void => setCameraInitialized(true)}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
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
        <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {recordingMode && VideoRecorder}
            {!recordingMode && VideoPlayer}
            {!recordingMode &&
                !previewReady && ( // TODO: this was added after the iOS release
                    <ActivityIndicator
                        size={theme.size.xl}
                        color={theme.colors.onPrimary}
                        style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                    />
                )}
            {recordingMode && settings.overlay && (
                <Stack
                    align={'center'}
                    justify={'center'}
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        },
                    ]}
                >
                    <Image
                        resizeMethod="resize"
                        style={{ height: '100%', width: '100%', opacity: 0.35, resizeMode: 'contain' }}
                        source={getOverlayImage(swing, settings.handedness, activeCameraIndex === 0 ? 'back' : 'front')}
                    />
                </Stack>
            )}
            {recordingMode && (
                <View
                    style={{
                        width: '100%',
                        top: 0,
                        left: 0,
                        position: 'absolute',
                        justifyContent: 'flex-end',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <StatusBar barStyle={'light-content'} />
                    <SafeAreaView style={{ height: COLLAPSED_HEIGHT + insets.top }}>
                        <Stack
                            direction={'row'}
                            align={'center'}
                            justify={'center'}
                            style={{
                                flex: 1,
                                position: 'relative',
                                paddingHorizontal: theme.spacing.md,
                            }}
                        >
                            {recordingMode && !isRecording && <View style={{ flex: 1 }} />}
                            {isRecording && !showCountDown && <VideoTimer visible={isRecording} />}
                            {recordingMode && !isRecording && token && (
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    {/* @ts-ignore */}
                                    <TouchableOpacity onPress={(): void => navigation.push(ROUTES.SETTINGS_GROUP)}>
                                        <MatIcon
                                            name={'settings'}
                                            size={theme.size.md}
                                            color={theme.colors.onPrimary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Stack>
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
                                  setShowCountDown(true);
                                  setIsRecording(true);
                              } else {
                                  void endRecording();
                              }
                          }
                        : (): void => {
                              // Play / Pause the video
                              setIsPlaying(!isPlaying);
                          }
                }
                onBack={
                    recordingMode
                        ? (): void => props.navigation.pop() // Cancel
                        : (): void => {
                              // Retake
                              setRecordingMode(true);
                              setRecordedVideo('');
                          }
                }
                onNext={
                    recordingMode
                        ? (): void => {
                              // Toggle Camera
                              setCameraInitialized(false);
                              setActiveCameraIndex((i) => (i + 1) % cameraDevices.length);
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
