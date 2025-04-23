import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { aspectHeight, width } from '../../utilities/dimensions';
import { YoutubeCard } from './YoutubeCard';
import { useAppTheme } from '../../theme';
import { LessonCard } from './LessonCard';
import { LessonBasicDetails } from '../../redux/apiServices/lessonsService';
import { WelcomeVideo } from '../../redux/apiServices/configurationService';
import { format } from 'date-fns';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { ROUTES } from '../../navigation/routeConfig';

type LessonCarouselProps = {
    data: (LessonBasicDetails | WelcomeVideo)[];
};
export const LessonCarousel: React.FC<LessonCarouselProps> = (props) => {
    const { data } = props;
    const progress = useSharedValue<number>(0);
    const theme = useAppTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
                            navigation.navigate(ROUTES.LESSON, { lesson: null });
                        }}
                    />
                )
            }
        />
    );
};
