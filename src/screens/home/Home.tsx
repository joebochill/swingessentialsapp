import React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, H7 } from '@pxblue/react-native-components';
import { VideoCard, CollapsibleHeaderLayout, ResizableHeader } from '../../components';
import { ROUTES } from '../../constants/routes';
import bg from '../../images/bg_1.jpg';

import Carousel from 'react-native-snap-carousel';
import { useSelector, useDispatch } from 'react-redux';
import { getLongDate, width } from '../../utilities';
import { spaces, sharedStyles, unit, purple } from '../../styles';
import { PlaceholderLesson } from '../../constants/lessons';
import { ApplicationState } from '../../__types__';
import { loadUserContent } from '../../redux/actions';

export const Home = props => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const dispatch = useDispatch();

    const latestLessons = lessons.closed.length > 0 ? lessons.closed : [PlaceholderLesson];
    return (
        <CollapsibleHeaderLayout 
            backgroundImage={bg} 
            title={'SWING ESSENTIALS'} 
            subtitle={'a pro in your pocket™'}
            refreshing={lessons.loading || credits.inProgress || tips.loading}
            onRefresh={() => {
                dispatch(loadUserContent());
            }}
        >
            <>
                <View style={sharedStyles.sectionHeader}>
                    <H7>Latest Lessons</H7>
                    <Body onPress={() => props.navigation.navigate(ROUTES.LESSONS)}>View All</Body>
                </View>
                <Carousel
                    data={latestLessons.slice(0, 3)}
                    renderItem={({ item }) => (
                        <VideoCard
                            headerTitle={item.request_date}
                            headerSubtitle={item.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}
                            style={{ marginBottom: 16 }}
                            video={item.response_video}
                            onExpand={() => props.navigation.push(ROUTES.LESSON, { lesson: item })}
                        />
                    )}
                    sliderWidth={width}
                    itemWidth={width - 2 * spaces.medium}
                    inactiveSlideScale={0.95}
                />
            </>
            <View style={[sharedStyles.sectionHeader, { marginTop: spaces.large }]}>
                <H7>Your Credits</H7>
            </View>
            <ListItem
                containerStyle={[sharedStyles.listItem]}
                contentContainerStyle={[sharedStyles.listItemContent]}
                bottomDivider
                chevron={true}
                pad={spaces.medium}
                onPress={() => props.navigation.navigate(ROUTES.SUBMIT)}
                title={<Body style={{ marginLeft: spaces.medium}}>Individual Lessons</Body>}
                rightTitle={`${credits.count} Left`}
                disabled={credits.count < 1}
                disabledStyle={sharedStyles.disabled}
                leftIcon={{
                    name: 'golf-course',
                    color: purple[500],
                    size: unit(24),
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                pad={spaces.medium}
                onPress={() => props.navigation.navigate(ROUTES.ORDER)}
                title={
                    <Body style={{ marginLeft: spaces.medium }}>
                        Order More
                    </Body>
                }
                leftIcon={{
                    name: 'shopping-cart',
                    color: purple[500],
                    size: unit(24),
                }}
            />

            {tips.tipList.length > 0 && (
                <>
                    <View style={[sharedStyles.sectionHeader, { marginTop: 32 }]}>
                        <H7>Tip of the Month</H7>
                        <Body onPress={() => props.navigation.navigate(ROUTES.TIPS)}>View All</Body>
                    </View>
                    <Carousel
                        data={tips.tipList.slice(0, 3)}
                        renderItem={({ item }) => (
                            <VideoCard
                                headerTitle={getLongDate(item.date)}
                                headerSubtitle={item.title}
                                style={{ marginBottom: 16 }}
                                video={item.video}
                                onExpand={() => props.navigation.push(ROUTES.TIP, { tip: item })}
                            />
                        )}
                        sliderWidth={width}
                        itemWidth={width - 2 * spaces.medium}
                        inactiveSlideScale={0.95}
                    />
                </>
            )}
        </CollapsibleHeaderLayout>
    );
};
