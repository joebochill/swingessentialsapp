import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { VideoCard, CollapsibleHeaderLayout, HomeTutorial, SEButton, H4, Label } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { width } from '../../utilities/dimensions';
import { useTheme, Subheading } from 'react-native-paper';
import bg from '../../images/banners/landing.jpg';

// Utilities
import { getLongDate } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadUserContent } from '../../redux/actions';
import { unit } from '../../styles/sizes';

export const Home = props => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    const latestLessons = lessons.closed.length > 0 ? lessons.closed : [placeholder];
    return (
        <CollapsibleHeaderLayout
            backgroundImage={bg}
            title={'SWING ESSENTIALS®'}
            subtitle={'The pro in your pocket'}
            mainAction={'menu'}
            refreshing={lessons.loading || credits.inProgress || tips.loading}
            onRefresh={() => {
                dispatch(loadUserContent());
            }}
            bottomPad={false}>
            <View style={[sharedStyles.sectionHeader]}>
                <Subheading style={listStyles.heading}>{'Latest Lessons'}</Subheading>
                <SEButton
                    mode={'outlined'}
                    title={'View All'}
                    onPress={() => props.navigation.navigate(ROUTES.LESSONS)}
                />
            </View>
            <Carousel
                data={latestLessons.slice(0, role === 'administrator' ? 5 : 3)}
                renderItem={({ item }) => (
                    <VideoCard
                        // headerIcon={item.type === 'in-person' ? 'settings-remote' : 'settings-remote'}
                        headerTitle={item.request_date}
                        headerSubtitle={role === 'administrator' ? item.username : undefined}
                        video={item.response_video}
                        onExpand={() => props.navigation.push(ROUTES.LESSON, { lesson: item })}
                    />
                )}
                sliderWidth={width}
                itemWidth={width - 2 * theme.spaces.medium}
                inactiveSlideScale={0.95}
            />

            <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.xLarge }]}>
                <Subheading style={listStyles.heading}>{'Lesson Credits'}</Subheading>
                <SEButton
                    mode={'outlined'}
                    title={'Order More'}
                    onPress={() => props.navigation.navigate(ROUTES.ORDER)}
                />
            </View>
            <View style={[flexStyles.row, flexStyles.paddingHorizontal, { justifyContent: 'space-between' }]}>
                <View
                    style={[
                        flexStyles.centered,
                        flexStyles.paddingMedium,
                        {
                            flex: 1,
                            borderWidth: unit(1),
                            borderRadius: theme.roundness,
                        },
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.light },
                    ]}>
                    <H4 style={{ lineHeight: unit(32) }} color={'primary'}>
                        {credits.count}
                    </H4>
                    <Label color={'primary'}>{`Credit${credits.count !== 1 ? 's' : ''} Remaining`}</Label>
                    {credits.count > 0 && (
                        <SEButton
                            mode={'outlined'}
                            title={'Submit a Swing'}
                            icon={'publish'}
                            style={{ marginTop: theme.spaces.medium }}
                            onPress={() => props.navigation.navigate(ROUTES.SUBMIT)}
                        />
                    )}
                </View>
            </View>

            {tips.tipList.length > 0 && (
                <>
                    <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.xLarge }]}>
                        <Subheading style={listStyles.heading}>{'Tip of the Month'}</Subheading>
                        <SEButton
                            mode={'outlined'}
                            title={'View All'}
                            onPress={() => props.navigation.navigate(ROUTES.TIPS)}
                        />
                    </View>
                    <Carousel
                        data={tips.tipList.slice(0, 3)}
                        renderItem={({ item }) => (
                            <VideoCard
                                // headerIcon={'event'}
                                headerTitle={item.title}
                                headerSubtitle={role === 'administrator' ? getLongDate(item.date) : ''}
                                video={item.video}
                                onExpand={() => props.navigation.push(ROUTES.TIP, { tip: item })}
                            />
                        )}
                        sliderWidth={width}
                        itemWidth={width - 2 * theme.spaces.medium}
                        inactiveSlideScale={0.95}
                    />
                </>
            )}
            <HomeTutorial />
        </CollapsibleHeaderLayout>
    );
};
