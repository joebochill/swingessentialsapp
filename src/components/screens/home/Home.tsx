import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { RefreshControl, View, ScrollView } from 'react-native';
import { ROUTES } from '../../../navigation/routeConfig';
import bg from '../../../assets/images/banners/landing.jpg';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { useCollapsibleHeader } from '../../layout/CollapsibleHeader';
import { Header } from '../../layout/CollapsibleHeader/Header';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '../../typography/SectionHeader';
import { Stack } from '../../layout/Stack';
import { SEButton } from '../../common/SEButton';
import { Typography } from '../../typography';
import { HomeTutorial } from '../../tutorials';
import { RootState } from '../../../redux/store';
import { useGetCreditsQuery } from '../../../redux/apiServices/creditsService';
import { useGetTipsQuery } from '../../../redux/apiServices/tipsService';
import { useGetCompletedLessonsQuery } from '../../../redux/apiServices/lessonsService';
import { useGetWelcomeVideoQuery } from '../../../redux/apiServices/configurationService';
import { loadUserData } from '../../../redux/thunks';
import { LessonCarousel } from '../../videos/LessonCarousel';
import { VideoCarousel } from '../../videos/VideoCarousel';

export const Home: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { data: lessons = [] } = {}, isFetching: loadingLessons } = useGetCompletedLessonsQuery(
        { page: 1, users: '' },
        { skip: !token }
    );
    const { data: tips = [], isFetching: loadingTips } = useGetTipsQuery();
    const { data: placeholder = { video: '', description: '' } } = useGetWelcomeVideoQuery();

    const { data: { count: credits = 0 } = {}, isFetching: loadingCredits } = useGetCreditsQuery(undefined, {
        skip: !token,
    });

    const latestLessons = useMemo(() => {
        return lessons.length > 0 ? lessons : [placeholder];
    }, [lessons, placeholder]);

    const slicedLessons = useMemo(() => {
        return latestLessons.slice(0, role === 'administrator' ? 25 : 5);
    }, [latestLessons, role]);

    const slicedTips = useMemo(() => {
        return tips.slice(0, 5);
    }, [tips]);

    return (
        <>
            <Header
                backgroundImage={bg}
                title={'SWING ESSENTIALS'}
                subtitle={'The pro in your pocket'}
                mainAction={'menu'}
                navigation={navigation}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingLessons || loadingCredits || loadingTips}
                        onRefresh={(): void => {
                            dispatch(loadUserData());
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
                style={{
                    backgroundColor: theme.colors.background,
                }}
            >
                {/* LOGIN PANEL */}
                {role === 'anonymous' && (
                    <Stack
                        direction={'row'}
                        gap={theme.spacing.md}
                        style={{
                            padding: theme.spacing.md,
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: theme.colors.outline,
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <SEButton
                            mode={'contained'}
                            title={'Sign Up Today'}
                            style={{ flex: 1 }}
                            onPress={(): void => navigation.navigate(ROUTES.REGISTER)}
                        />
                        <SEButton
                            mode={'contained'}
                            title={'Sign In'}
                            style={{ flex: 1 }}
                            onPress={(): void => navigation.navigate(ROUTES.LOGIN)}
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
                            onPress={(): void => navigation.navigate(ROUTES.LESSONS)}
                        />
                    }
                    style={{
                        marginTop: theme.spacing.md,
                        marginHorizontal: theme.spacing.md,
                    }}
                />

                <LessonCarousel data={slicedLessons} />

                {/* LESSON CREDITS */}
                <SectionHeader
                    title={'Lesson Credits'}
                    action={
                        <SEButton
                            mode={'outlined'}
                            title={'Order More'}
                            onPress={(): void => navigation.navigate(ROUTES.ORDER)}
                        />
                    }
                    style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                />
                <Stack
                    align={'center'}
                    style={{
                        marginHorizontal: theme.spacing.md,
                        padding: theme.spacing.md,
                        borderWidth: 1,
                        borderRadius: theme.roundness,
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                    }}
                >
                    <Typography variant={'displaySmall'} color={theme.dark ? 'onPrimary' : 'primary'}>
                        {credits}
                    </Typography>
                    <Typography variant={'bodyLarge'} color={theme.dark ? 'onPrimary' : 'primary'}>{`Credit${
                        credits !== 1 ? 's' : ''
                    } Remaining`}</Typography>
                    {credits > 0 && (
                        <SEButton
                            mode={'outlined'}
                            title={'Submit a Swing'}
                            style={{ marginTop: theme.spacing.md }}
                            onPress={(): void => navigation.navigate(ROUTES.SUBMIT)}
                        />
                    )}
                </Stack>

                {/* TIP OF THE MONTH */}
                {tips.length > 0 && (
                    <View style={{ marginTop: theme.spacing.xxl }}>
                        <SectionHeader
                            title={'Tip of the Month'}
                            action={
                                <SEButton
                                    mode={'outlined'}
                                    title={'View All'}
                                    onPress={(): void => navigation.navigate(ROUTES.TIPS)}
                                />
                            }
                            style={{ marginHorizontal: theme.spacing.md }}
                        />

                        <VideoCarousel data={slicedTips} />
                    </View>
                )}
            </ScrollView>
            <HomeTutorial />
        </>
    );
};
