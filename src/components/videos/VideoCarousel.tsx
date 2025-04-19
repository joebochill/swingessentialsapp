import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { aspectHeight, width } from '../../utilities/dimensions';
import { YoutubeCard } from './YoutubeCard';
import { useAppTheme } from '../../theme';

type BasicVideo = {
    video: string;
    title: string;
    subtitle?: string;
    onExpand?: () => void;
};
type VideoCarouselProps = {
    data: BasicVideo[];
};
export const VideoCarousel: React.FC<VideoCarouselProps> = (props) => {
    const { data } = props;
    const progress = useSharedValue<number>(0);
    const theme = useAppTheme();

    const scaleMarginOffset = ((aspectHeight(width) + theme.size.xl) * 0.08) / 2;

    return (
        <Carousel<BasicVideo>
            data={data}
            height={aspectHeight(width) + theme.size.xl}
            loop={false}
            width={width}
            style={{
                width: width,
                marginVertical: -scaleMarginOffset,
            }}
            mode="parallax"
            modeConfig={{
                parallaxScrollingScale: 0.92,
                parallaxAdjacentItemScale: 0.8,
                parallaxScrollingOffset: 48,
            }}
            onConfigurePanGesture={(gestureChain) => {
                gestureChain.activeOffsetX([-10, 10]);
            }}
            onProgressChange={progress}
            renderItem={({ item }) => (
                <YoutubeCard
                    video={item.video}
                    headerTitle={item.title}
                    headerSubtitle={item.subtitle}
                    onExpand={item.onExpand}
                />
            )}
        />
    );
};
