import downthelineLH from '@/assets/images/overlay-dtl-lh.png';
import downthelineRH from '@/assets/images/overlay-dtl-rh.png';
import faceonLH from '@/assets/images/overlay-fo-lh.png';
import faceonRH from '@/assets/images/overlay-fo-rh.png';
import { Icon } from '@/components/common/Icon';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { CountDown } from '@/components/videos/CountDown';
import { VideoControls } from '@/components/videos/RecordButton';
import { VideoTimer } from '@/components/videos/VideoTimer';
import { BLANK_USER, useGetUserDetailsQuery, UserAppSettings } from '@/redux/apiServices/userDetailsService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SEButton } from '@/components/common/SEButton';
import { Typography } from '@/components/typography/Typography';
import { SwingType, useRecordedVideo } from '@/components/videos/RecordedVideoProvider';
import { useEvent } from 'expo';
import { openSettings } from 'expo-linking';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSelector } from 'react-redux';

const getOverlayImage = (
    swing: SwingType,
    handedness: UserAppSettings['handed'],
    camera: CameraType
): ImageSourcePropType => {
    const options: ImageSourcePropType[] = swing === 'dtl' ? [downthelineRH, downthelineLH] : [faceonRH, faceonLH];
    let index = 0;

    if ((handedness === 'left' && camera === 'back') || (handedness === 'right' && camera === 'front')) {
        index = 1;
    }
    return options[index];
};

export default function RecordScreen() {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: user = BLANK_USER } = useGetUserDetailsQuery();
    const token = useSelector((state: RootState) => state.auth.token);

    const router = useRouter();
    const { swingKey } = useLocalSearchParams();
    const swing = swingKey as SwingType;
    const { setFoVideo, setDtlVideo } = useRecordedVideo();

    const cameraRef = useRef<CameraView>(null);
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [recording, setRecording] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const videoRef = useRef(null);
    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setShowCountDown] = useState(false);

    const [previewReady, setPreviewReady] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');
    const player = useVideoPlayer(recordedVideo ?? '');
    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });
    const { status } = useEvent(player, 'statusChange', {
        status: player.status,
    });

    const toggleCamera = useCallback((): void => {
        setCameraType((curr) => (curr === 'back' ? 'front' : 'back'));
    }, []);

    const startRecording = async () => {
        setShowCountDown(false);
        setRecording(true);
        const video = await cameraRef.current?.recordAsync({
            maxDuration: user.camera_duration,
            maxFileSize: 50 * (1024 * 1024),
            codec: 'avc1',
        });
        endRecording();
        setRecordedVideo(video?.uri || '');
    };
    const endRecording = async () => {
        cameraRef.current?.stopRecording();
        setRecording(false);
        setRecordingMode(false);
    };

    useEffect(() => {
        if (status === 'idle') {
            player.currentTime = 0;
            player.pause();
        }
    });

    const renderVideoCamera = () => {
        return (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill]}>
                <CameraView
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill]}
                    ref={cameraRef}
                    mode={'video'}
                    facing={cameraType}
                    enableTorch={showCountDown}
                    mute
                />
            </View>
        );
    };
    const renderVideoPlayer = () => (
        <VideoView
            ref={videoRef}
            player={player}
            onFirstFrameRender={() => setPreviewReady(true)}
            contentFit="contain"
            nativeControls={false}
            style={{
                height: '100%',
                width: '100%',
            }}
        />
    );

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: theme.dark ? theme.colors.background : theme.colors.primary,
                }}
            >
                <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                    {'Permissions'}
                </Typography>
                <Typography
                    variant={'bodyMedium'}
                    fontWeight={'light'}
                    color={'onPrimary'}
                    align={'center'}
                    style={{
                        marginTop: theme.spacing.sm,
                    }}
                >
                    {'Swing Essentials needs access to your camera to record videos.'}
                </Typography>
                <SEButton
                    mode={theme.dark ? 'contained' : 'outlined'}
                    buttonColor={theme.dark ? undefined : 'white'}
                    title={'Allow Camera Access'}
                    style={{
                        alignSelf: 'center',
                        marginTop: theme.spacing.xxl,
                    }}
                    onPress={async (): Promise<void> => {
                        if (permission?.canAskAgain) {
                            await requestPermission();
                        } else {
                            openSettings();
                        }
                    }}
                />
                <SEButton
                    buttonColor={'transparent'}
                    style={{ marginTop: theme.spacing.md, alignSelf: 'center' }}
                    title={'Back'}
                    onPress={() => router.back()}
                />
            </View>
            // <View
            //   style={{
            //     flex: 1,
            //     alignItems: "center",
            //     justifyContent: "center",
            //     padding: theme.spacing.md,
            //   }}
            // >
            //   <Button
            //     mode="contained"
            //     onPress={async () => {
            //       await requestPermission();
            //     }}
            //   >
            //     Grant Camera Permission
            //   </Button>
            // </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'stretch',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
        >
            {recordingMode && renderVideoCamera()}
            {!recordingMode && renderVideoPlayer()}
            {!recordingMode && !previewReady && (
                <ActivityIndicator
                    size={theme.size.xl}
                    color={theme.colors.onPrimary}
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0,
                    }}
                />
            )}
            {recordingMode && Boolean(user.camera_overlay) && (
                <Stack
                    pointerEvents="none"
                    align={'center'}
                    justify={'center'}
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 100,
                        },
                    ]}
                >
                    <Image
                        resizeMethod="resize"
                        style={{
                            height: '100%',
                            width: '100%',
                            opacity: 0.35,
                            resizeMode: 'contain',
                        }}
                        source={getOverlayImage(swing, user.handed, cameraType)}
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
                            {recordingMode && !recording && <View style={{ flex: 1 }} />}
                            {recording && !showCountDown && <VideoTimer visible={recording} />}
                            {recordingMode && !recording && token && (
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Pressable
                                        onPress={(): void => {
                                            router.push('/(drawer)/(screens)/settings');
                                        }}
                                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                                    >
                                        <Icon name={'settings'} size={theme.size.md} color={theme.colors.onPrimary} />
                                    </Pressable>
                                </View>
                            )}
                        </Stack>
                    </SafeAreaView>
                </View>
            )}
            {showCountDown && <CountDown startValue={user.camera_delay} onFinish={startRecording} />}
            <VideoControls
                mode={recordingMode ? 'record' : 'play'}
                active={recording || isPlaying}
                onAction={
                    recordingMode
                        ? (): void => {
                              // Start / End recording
                              if (!recording) {
                                  if (showCountDown) {
                                      setShowCountDown(false);
                                  } else {
                                      if (user.camera_delay > 0) {
                                          setShowCountDown(true);
                                      } else {
                                          startRecording();
                                      }
                                  }
                              } else {
                                  endRecording();
                              }
                          }
                        : (): void => {
                              // Play / Pause the video
                              if (isPlaying) {
                                  player.pause();
                              } else {
                                  player.play();
                              }
                          }
                }
                onBack={
                    recordingMode
                        ? (): void => {
                              if (router.canGoBack()) {
                                  router.back(); // Cancel
                              } else {
                                  router.replace('/');
                              }
                          }
                        : (): void => {
                              // Retake
                              setRecordingMode(true);
                              setRecordedVideo('');
                          }
                }
                onNext={
                    recordingMode
                        ? (): void => {
                              toggleCamera();
                          }
                        : (): void => {
                              // Use-Video
                              if (swing === 'fo') {
                                  setFoVideo(recordedVideo);
                              } else {
                                  setDtlVideo(recordedVideo);
                              }
                              setPreviewReady(false);
                              if (router.canGoBack()) {
                                  router.back();
                              } else {
                                  router.replace('/');
                              }
                          }
                }
            />
        </View>
    );
}
