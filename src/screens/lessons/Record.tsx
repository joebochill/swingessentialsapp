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
import Video from 'react-native-video';

// Overlay images
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';
import { ROUTES } from '../../constants/routes';
import { Logger } from '../../utilities/logging';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Camera, CameraDevice, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraType, Handedness, SwingType } from '../../__types__';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { Stack } from '../../components/layout';
import { CountDown, VideoControls, VideoTimer } from '../../components/videos';
import { Icon } from '../../components/Icon';
import { BLANK_USER, useGetUserDetailsQuery } from '../../redux/apiServices/userDetailsService';
import { RootState } from '../../redux/store';

const getOverlayImage = (swing: SwingType, handedness: Handedness, camera: CameraType): ImageSourcePropType => {
    const options: ImageSourcePropType[] = swing === 'dtl' ? [downthelineRH, downthelineLH] : [faceonRH, faceonLH];
    let index = 0;

    if ((handedness === 'left' && camera === 'back') || (handedness === 'right' && camera === 'front')) {
        index = 1;
    }
    return options[index];
};

export const Record: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'RECORD'>>();
    const videoRef = useRef(null);
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const { onReturn, swing } = route.params;
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

    const { data: user = BLANK_USER, isSuccess: hasUserData, isFetching, refetch } = useGetUserDetailsQuery();
    const token = useSelector((state: RootState) => state.auth.token);

    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setShowCountDown] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');
    const autoEndTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        }
        setIsRecording(false);
        if (autoEndTimeout.current) clearTimeout(autoEndTimeout.current);
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
        autoEndTimeout.current = setTimeout(() => {
            void endRecording();
        }, user.camera_duration * 1000);
    }, [camera, user.camera_duration, cameraInitialized, endRecording]);

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
                setPreviewReady(true);
                // @ts-expect-error we know seek exists even though the ref is not strongly typed
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
            {!recordingMode && !previewReady && (
                <ActivityIndicator
                    size={theme.size.xl}
                    color={theme.colors.onPrimary}
                    style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}
                />
            )}
            {recordingMode && user.camera_overlay && (
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
                        source={getOverlayImage(swing, user.handed, activeCameraIndex === 0 ? 'back' : 'front')}
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
                                    <TouchableOpacity onPress={(): void => navigation.push(ROUTES.SETTINGS_GROUP)}>
                                        <Icon name={'settings'} size={theme.size.md} color={theme.colors.onPrimary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Stack>
                    </SafeAreaView>
                </View>
            )}
            {showCountDown && <CountDown startValue={user.camera_delay} onFinish={(): void => startRecording()} />}
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
                        ? (): void => navigation.pop() // Cancel
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
                              onReturn(recordedVideo);
                              setPreviewReady(false);
                              navigation.pop();
                          }
                }
            />
        </View>
    );
};
