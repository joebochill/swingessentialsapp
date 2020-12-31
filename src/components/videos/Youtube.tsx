import React from 'react';
// Components
import { Platform, View, ViewProperties } from 'react-native';
import YT, { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { Thumbnail } from 'react-native-thumbnail-video';

// Constants
import { YOUTUBE_API_KEY } from '../../constants';

// Utilities
import { Logger } from '../../utilities/logging';

type YouTubeProps = ViewProperties & {
    apiKey?: string;
    videoId: string;
    playlistId?: string;
    play?: boolean;
    loop?: boolean;
    fullscreen?: boolean;
    controls?: number;
    showFullscreenButton?: boolean;
    showinfo?: boolean;
    modestbranding?: boolean;
    origin?: string;
    rel?: boolean;
    resumePlayAndroid?: boolean;
    onError?: Function;
};

const openStandaloneAndroidPlayer = (id: string): void => {
    YouTubeStandaloneAndroid.playVideo({
        apiKey: YOUTUBE_API_KEY,
        videoId: id,
        autoplay: true,
        startTime: 0,
    }).catch((errorMessage: string) => {
        Logger.logError({
            code: 'YT100',
            description: 'YouTube Player error.',
            rawErrorMessage: errorMessage,
        });
    });
};

export const YouTube = (props: YouTubeProps) => {
    const {
        videoId,
        apiKey = YOUTUBE_API_KEY,
        play = false,
        fullscreen = false,
        loop = false,
        showinfo = true,
        modestbranding = false,
        showFullscreenButton = true,
        controls = 2,
        rel = false,
    } = props;

    return Platform.OS === 'android' ? (
        <View {...props.style}>
            <Thumbnail
                url={`https://www.youtube.com/watch?v=${videoId}`}
                onPress={() => openStandaloneAndroidPlayer(videoId)}
                imageHeight="100%"
                imageWidth="100%"
                showPlayIcon={true}
                type="maximum"
            />
        </View>
    ) : (
        <YT
            key={videoId + Date.now()}
            apiKey={apiKey}
            videoId={props.videoId}
            play={play}
            fullscreen={fullscreen}
            loop={loop}
            showinfo={showinfo}
            showFullscreenButton={showFullscreenButton}
            modestbranding={modestbranding}
            controls={controls}
            rel={rel}
            {...props}
        />
    );
};
