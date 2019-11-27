import React from 'react';
import YT from 'react-native-youtube';
import { ViewProperties } from 'react-native';
import { YOUTUBE_API_KEY } from '../constants';

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
}

export const YouTube = (props: YouTubeProps) => {
    const {
        videoId,
        apiKey=YOUTUBE_API_KEY,
        play=false, 
        fullscreen=false, 
        loop=false,
        showinfo=false,
        modestbranding=false,
        controls=2,
        rel=false,
    } = props;
    return (
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
}

