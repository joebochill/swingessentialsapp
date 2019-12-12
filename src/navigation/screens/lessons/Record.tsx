import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Platform, Image } from 'react-native';
import { sharedStyles } from '../../../styles';
import { RNCamera } from 'react-native-camera';
import { VideoControls, CountDown, VideoTimer } from '../../../components';
import Video from 'react-native-video';

// Overlay images
import faceonLH from '../../../images/overlay-fo-lh.png';
import faceonRH from '../../../images/overlay-fo-rh.png';
import downthelineLH from '../../../images/overlay-dtl-lh.png';
import downthelineRH from '../../../images/overlay-dtl-rh.png';

const DESIRED_RATIO = "16:9";

// TODO: Fix the flash mode
// TODO: Delay/Duration from settings
type CameraType = 'front' | 'back';
type HandednessType = 'left' | 'right';
type SwingType = 'dtl' | 'fo';

const getOverlayImage = (swing: SwingType, handedness: HandednessType, camera: CameraType) => {
    let options = (swing === 'dtl') ? [downthelineRH, downthelineLH] : [faceonRH, faceonLH];
    let index = 0;

    if((handedness === 'left' && camera === 'back') || (handedness === 'right' && camera === 'front')){
        index = 1;
    }
    return options[index];
}

export const Record = (props) => {
    const cameraRef = useRef(null);
    const onReturn = props.navigation.getParam('onReturn', () => { });
    const swing: SwingType = props.navigation.getParam('swing', () => { });

    // TODO: get these from the API
    const overlay = true;
    const delay = 3;
    const duration = 5;
    const handedness: HandednessType = 'right';

    const cameras: CameraType[] = ['back', 'front'];
    const [cameraType, setCameraType] = useState(0);
    const [cameraRatios, setCameraRatios] = useState([]);

    const [recordingMode, setRecordingMode] = useState(true);
    const [showCountDown, setCountdownStarted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [recordedVideo, setRecordedVideo] = useState('');

    const _startRecording = useCallback(async () => {
        setCountdownStarted(false);

        if (!cameraRef.current) {
            console.log('no camera object');
            return;
        }
        const options = {
            maxFileSize: 9.5 * 1024 * 1024,
            maxDuration: duration,
            quality: RNCamera.Constants.VideoQuality['720p']
        };

        const _video = await cameraRef.current.recordAsync(options);

        setRecordedVideo(_video.uri);
        setIsRecording(false);
        setRecordingMode(false);
    }, [cameraRef, delay, duration]);

    const _endRecording = useCallback(() => {
        setCountdownStarted(false);
        if (!cameraRef.current) {
            console.log('camera error');
            return;
        }
        if (isRecording) cameraRef.current.stopRecording();

        setRecordedVideo('');
        setIsRecording(false);
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android' && cameraRef.current) {
            const getAvailableRatios = async () => {
                const ratios = await cameraRef.current.getSupportedRatiosAsync();
                setCameraRatios(ratios);
            }
            getAvailableRatios();
        }
    }, [cameraRef]);

    const VideoRecorder = (
        <RNCamera
            ref={cameraRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange' }}
            type={RNCamera.Constants.Type[cameras[cameraType]]}
            // onCameraReady={() => setRecordingMode(true)}
            flashMode={showCountDown ?
                RNCamera.Constants.FlashMode['torch'] :
                RNCamera.Constants.FlashMode['off']
            }
            captureAudio={false}
            ratio={cameraRatios.find((ratio) => ratio === DESIRED_RATIO) || cameraRatios[cameraRatios.length - 1]}
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
            repeat={true}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch={"ignore"}
            style={{ height: '100%', width: '100%' }}
        />
    );
    return (
        <View style={{ flex: 1, alignItems: 'stretch' }}>
            {recordingMode && VideoRecorder}
            {!recordingMode && VideoPlayer}
            {overlay &&
                <View style={[sharedStyles.absoluteFull, sharedStyles.centered]}>
                    <Image
                        resizeMethod='resize'
                        style={{ height: '100%', width: '100%', opacity: 0.35, resizeMode: 'contain' }}
                        source={getOverlayImage(swing, handedness, cameras[cameraType])}
                    />
                </View>
            }
            {isRecording && !showCountDown &&
                <VideoTimer visible={isRecording} />
            }
            {showCountDown &&
                <CountDown
                    startValue={delay}
                    onFinish={() => _startRecording()}
                />
            }
            <VideoControls
                mode={recordingMode ? 'record' : 'play'}
                active={isRecording || isPlaying}
                onAction={recordingMode ?
                    () => { // Start / End recording
                        if (!isRecording) {
                            setCountdownStarted(true);
                            setIsRecording(true);
                        }
                        else _endRecording();
                    } :
                    () => { // Play / Pause the video
                        setIsPlaying(!isPlaying);
                    }
                }
                onBack={recordingMode ?
                    () => props.navigation.pop() // Go Back
                    :
                    () => {
                        setRecordingMode(true);
                        setRecordedVideo('');
                    }
                }
                onNext={recordingMode ?
                    () => { // Toggle Camera
                        setCameraType((cameraType + 1) % cameras.length)
                    }
                    :
                    () => { // Use-Video
                        onReturn(recordedVideo);
                        props.navigation.pop();
                    }
                }
            />
        </View >
    );
}