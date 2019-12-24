import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, H7, VideoCard, CollapsibleHeaderLayout } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Constants
import { ROUTES } from '../../constants/routes';
import { PlaceholderLesson } from '../../constants/lessons';

// Styles
import { sharedStyles} from '../../styles';
import { spaces, unit, sizes } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';
import { useTheme } from '../../styles/theme';
import bg from '../../images/bg_1.jpg';

// Utilities
import { getLongDate } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadUserContent } from '../../redux/actions';

export const Home = props => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useTheme();

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
            bottomPad={false}
        >
            <>
                <View style={sharedStyles.sectionHeader}>
                    <H7>Latest Lessons</H7>
                    <Body onPress={() => props.navigation.navigate(ROUTES.LESSONS)}>View All</Body>
                </View>
                <Carousel
                    data={latestLessons.slice(0, role === 'administrator' ? 5 : 3)}
                    renderItem={({ item }) => (
                        <VideoCard
                            headerTitle={item.request_date}
                            headerSubtitle={role === 'administrator' ? item.username : (item.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson')}
                            style={{ marginBottom: spaces.medium }}
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
                pad={spaces.medium}
                onPress={() => props.navigation.navigate(ROUTES.SUBMIT)}
                title={<Body style={{ marginLeft: spaces.medium }}>Individual Lessons</Body>}
                rightTitle={<Body>{`${credits.count} Left`}</Body>}
                disabled={credits.count < 1}
                disabledStyle={sharedStyles.disabled}
                leftIcon={{
                    name: 'golf-course',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                pad={spaces.medium}
                onPress={() => props.navigation.navigate(ROUTES.ORDER)}
                title={<Body style={{ marginLeft: spaces.medium }}>Order More</Body>}
                leftIcon={{
                    name: 'shopping-cart',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                }}
            />

            {tips.tipList.length > 0 && (
                <>
                    <View style={[sharedStyles.sectionHeader, { marginTop: spaces.xLarge }]}>
                        <H7>Tip of the Month</H7>
                        <Body onPress={() => props.navigation.navigate(ROUTES.TIPS)}>View All</Body>
                    </View>
                    <Carousel
                        data={tips.tipList.slice(0, 3)}
                        renderItem={({ item }) => (
                            <VideoCard
                                headerTitle={getLongDate(item.date)}
                                headerSubtitle={item.title}
                                style={{ marginBottom: spaces.medium }}
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
