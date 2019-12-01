import React, { useRef, useState } from 'react';
import Video from 'react-native-video';
import { View, TouchableOpacity, ViewProperties, StyleSheet } from 'react-native';
import { width, aspectWidth } from '../utilities';
import { sizes, spaces, transparent, oledBlack, white } from '../styles';
import { Icon } from 'react-native-elements';


type VideoProps = ViewProperties & {
    source: string;
}

export const SEVideo = (props: VideoProps) => {
    const { source, style } = props;
    const vid = useRef(null)
    const [playing, setPlaying] = useState(false);

    const portraitWidth = (width - 3 * spaces.medium) / 2;
    const portraitHeight = aspectWidth(portraitWidth);

    return (
        <View style={[
            {
                width: portraitWidth,
                height: portraitHeight,
                backgroundColor: oledBlack[900],
            }, style]
        }>
            <TouchableOpacity 
                style={{ height: '100%', width: '100%' }}
                onPress={() => setPlaying(!playing)}
            >
                <Video
                    source={{ uri: source }}
                    ref={vid}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    paused={!playing}
                    onEnd={() => setPlaying(false)}
                    resizeMode="contain"
                    repeat={true}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={"ignore"}
                    style={{ height: '100%', width: '100%' }}
                />
                <View style={styles.fullCentered}>
                    <Icon
                        name={'play-arrow'}
                        size={sizes.large}
                        color={white[50]}
                        underlayColor={transparent}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    fullCentered:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
})




