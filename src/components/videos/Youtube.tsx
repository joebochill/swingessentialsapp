import React from 'react';
import YT, { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { Thumbnail } from 'react-native-thumbnail-video';

import { View, ViewProperties, Platform } from 'react-native';
import { YOUTUBE_API_KEY } from '../../constants';

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
        // logLocalError('136: Youtube Player Error (Tip): ' + errorMessage);
        console.log('YOUTUBE Player Error: ' + errorMessage);
    });
};

export const YouTube = (props: YouTubeProps) => {
    const {
        videoId,
        apiKey = YOUTUBE_API_KEY,
        play = false,
        fullscreen = false,
        loop = false,
        showinfo = false,
        modestbranding = false,
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
            modestbranding={modestbranding}
            controls={controls}
            rel={rel}
            {...props}
        />
    );
};
