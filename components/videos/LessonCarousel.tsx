import { LessonCard } from '@/components/videos/LessonCard';
import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { WelcomeVideo } from '@/redux/apiServices/configurationService';
import { LessonBasicDetails } from '@/redux/apiServices/lessonsService';
import { useAppTheme } from '@/theme';
import { aspectHeight, width } from '@/utilities/dimensions';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

type LessonCarouselProps = {
    data: (LessonBasicDetails | WelcomeVideo)[];
};
export const LessonCarousel: React.FC<LessonCarouselProps> = (props) => {
    const router = useRouter();
    const { data } = props;
    const progress = useSharedValue<number>(0);
    const theme = useAppTheme();
    const scaleMarginOffset = ((aspectHeight(width) + theme.size.xl) * 0.08) / 2;

    return (
        <Carousel<LessonBasicDetails | WelcomeVideo>
            key={data.length}
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
                gestureChain.activeOffsetX([-30, 30]);
            }}
            onProgressChange={progress}
            renderItem={({ item }) =>
                (item as LessonBasicDetails).request_url ? (
                    <LessonCard lessonURL={(item as LessonBasicDetails).request_url} />
                ) : (
                    <YoutubeCard
                        video={(item as WelcomeVideo).video}
                        headerTitle={format(new Date(), 'yyyy-MM-dd')}
                        onExpand={() => {
                            router.push({ pathname: '/(drawer)/(screens)/(lessons)' });
                        }}
                    />
                )
            }
        />
    );
};
