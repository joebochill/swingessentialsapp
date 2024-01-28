import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import {
    VideoCard,
    CollapsibleHeaderLayout,
    HomeTutorial,
    SEButton,
    Typography,
    Stack,
    SectionHeader,
} from '../../components';
import Carousel from 'react-native-snap-carousel';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { width } from '../../utilities/dimensions';
import bg from '../../images/banners/landing.jpg';

// Utilities
import { getLongDate } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadUserContent } from '../../redux/actions';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../styles/theme';

export const Home: React.FC<StackScreenProps<RootStackParamList, 'Home'>> = (props) => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useAppTheme();

    const latestLessons = lessons.closed.length > 0 ? lessons.closed : [placeholder];
    return (
        <CollapsibleHeaderLayout
            backgroundImage={bg}
            title={'SWING ESSENTIALS'}
            subtitle={'The pro in your pocket'}
            mainAction={'menu'}
            refreshing={lessons.loading || credits.inProgress || tips.loading}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadUserContent());
            }}
            bottomPad={false}
            navigation={props.navigation}
        >
            {/* LOGIN PANEL */}
            {role === 'anonymous' && (
                <Stack
                    direction={'row'}
                    space={theme.spacing.md}
                    style={{
                        padding: theme.spacing.md,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.primaryContainer,
                    }}
                >
                    <SEButton
                        mode={'contained'}
                        title={'Sign Up Today'}
                        style={{ flex: 1 }}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.REGISTER)}
                    />
                    <SEButton
                        mode={'contained'}
                        title={'Sign In'}
                        style={{ flex: 1 }}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.LOGIN)}
                    />
                </Stack>
            )}

            {/* LATEST LESSONS */}
            <SectionHeader
                title={'Latest Lessons'}
                action={
                    <SEButton
                        mode={'outlined'}
                        title={'View All'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.LESSONS)}
                    />
                }
                style={{ marginTop: theme.spacing.md }}
            />
            <Carousel
                data={latestLessons.slice(0, role === 'administrator' ? 5 : 3)}
                renderItem={({ item }): JSX.Element => (
                    <VideoCard
                        headerTitle={item.request_date}
                        headerSubtitle={role === 'administrator' ? item.username : undefined}
                        video={item.response_video}
                        // @ts-ignore
                        onExpand={(): void => props.navigation.push(ROUTES.LESSON, { lesson: item })}
                    />
                )}
                sliderWidth={width}
                itemWidth={width - 2 * theme.spacing.md}
                inactiveSlideScale={0.95}
            />

            {/* LESSON CREDITS */}
            <SectionHeader
                title={'Lesson Credits'}
                action={
                    <SEButton
                        mode={'outlined'}
                        title={'Order More'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.ORDER)}
                    />
                }
                style={{ marginTop: theme.spacing.md }}
            />
            <Stack
                align={'center'}
                style={{
                    marginHorizontal: theme.spacing.md,
                    padding: theme.spacing.md,
                    borderWidth: 1,
                    borderRadius: theme.roundness,
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.primaryContainer,
                }}
            >
                <Typography variant={'displaySmall'} color={'primary'}>
                    {credits.count}
                </Typography>
                <Typography variant={'bodyLarge'} color={'primary'}>{`Credit${
                    credits.count !== 1 ? 's' : ''
                } Remaining`}</Typography>
                {credits.count > 0 && (
                    <SEButton
                        mode={'outlined'}
                        title={'Submit a Swing'}
                        icon={'publish'}
                        style={{ marginTop: theme.spacing.md }}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SUBMIT)}
                    />
                )}
            </Stack>

            {/* TIP OF THE MONTH */}
            {tips.tipList.length > 0 && (
                <View style={{ marginTop: theme.spacing.md }}>
                    <SectionHeader
                        title={'Tip of the Month'}
                        action={
                            <SEButton
                                mode={'outlined'}
                                title={'View All'}
                                // @ts-ignore
                                onPress={(): void => props.navigation.navigate(ROUTES.TIPS)}
                            />
                        }
                    />
                    <Carousel
                        data={tips.tipList.slice(0, 3)}
                        renderItem={({ item }): JSX.Element => (
                            <VideoCard
                                // headerIcon={'event'}
                                headerTitle={item.title}
                                // @ts-ignore
                                headerSubtitle={role === 'administrator' ? getLongDate(item.date) : ''}
                                video={item.video}
                                // @ts-ignore
                                onExpand={(): void => props.navigation.push(ROUTES.TIP, { tip: item })}
                            />
                        )}
                        sliderWidth={width}
                        itemWidth={width - 2 * 8 /*theme.spaces.medium*/}
                        inactiveSlideScale={0.95}
                    />
                </View>
            )}

            {/* TUTORIAL */}
            <HomeTutorial />
        </CollapsibleHeaderLayout>
    );
};
