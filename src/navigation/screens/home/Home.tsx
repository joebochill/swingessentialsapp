import React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, H7 } from '@pxblue/react-native-components';
import { VideoCard, CollapsibleHeaderLayout } from '../../../components';
import { ROUTES } from '../../../constants/routes';
import bg from '../../../images/bg_1.jpg';

import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import { getLongDate, width } from '../../../utilities';
import { spaces, sharedStyles } from '../../../styles';
import { PlaceholderLesson } from '../../../constants/lessons';
import { ApplicationState } from '../../../__types__';

export const Home = props => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips.tipList);
    const credits = useSelector((state: ApplicationState) => state.credits);

    const latestLessons = lessons.closed.length > 0 ? lessons.closed : [PlaceholderLesson];

    return (
        <CollapsibleHeaderLayout backgroundImage={bg} title={'SWING ESSENTIALS'} subtitle={'a pro in your pocket'}>
            <>
                <View style={sharedStyles.sectionHeader}>
                    <H7>Latest Lessons</H7>
                    <Body onPress={() => props.navigation.navigate(ROUTES.LESSONS)}>View All</Body>
                </View>
                <Carousel
                    data={latestLessons.slice(0, 5)}
                    renderItem={({ item }) => (
                        <VideoCard
                            headerTitle={item.request_date}
                            headerSubtitle={'Remote Lesson'}
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
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.SUBMIT)}
                title={<Body style={{ marginLeft: 16 }}>Individual Lessons</Body>}
                rightTitle={`${credits.count} Left`}
                disabled={credits.count < 1}
                disabledStyle={sharedStyles.disabled}
                leftIcon={{
                    name: 'golf-course',
                    color: '#231f61',
                }}
            />
            {/* <ListItem
                disabled={credits.unlimited < 1 || credits.unlimitedActive}
                disabledStyle={sharedStyles.disabled}
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                onPress={() => { }}
                title={
                    <Body font={'regular'} style={{ marginLeft: 16 }}>
                        Activate Unlimited
                        </Body>
                }
                rightTitle={`${credits.unlimited} Left`}
                leftIcon={{
                    type: 'material-community',
                    name: 'infinity',
                    color: '#231f61',
                }}
            /> */}
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.ORDER)}
                title={
                    <Body font={'regular'} style={{ marginLeft: 16 }}>
                        Order More
                    </Body>
                }
                leftIcon={{
                    name: 'shopping-cart',
                    color: '#231f61',
                }}
            />

            {tips.length > 0 && (
                <>
                    <View style={[sharedStyles.sectionHeader, { marginTop: 32 }]}>
                        <H7>Tip of the Month</H7>
                        <Body onPress={() => props.navigation.navigate(ROUTES.TIPS)}>View All</Body>
                    </View>
                    <Carousel
                        data={tips.slice(0, 5)}
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
