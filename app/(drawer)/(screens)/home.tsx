import bg from '@/assets/images/banners/landing.jpg';
import { SEButton } from '@/components/common/SEButton';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { HomeTutorial } from '@/components/tutorials/Home';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { LessonCarousel } from '@/components/videos/LessonCarousel';
import { VideoCarousel } from '@/components/videos/VideoCarousel';
import { useGetWelcomeVideoQuery } from '@/redux/apiServices/configurationService';
import { useGetCreditsQuery } from '@/redux/apiServices/creditsService';
import { useGetCompletedLessonsQuery } from '@/redux/apiServices/lessonsService';
import { useGetTipsQuery } from '@/redux/apiServices/tipsService';
import { AppDispatch, RootState } from '@/redux/store';
import { loadUserData } from '@/redux/thunks';
import { useAppTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const scrollViewRef = useRef<ScrollView>(null);

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
        return latestLessons.slice(0, role === 'administrator' ? 10 : 5);
    }, [latestLessons, role]);

    const slicedTips = useMemo(() => {
        return tips.slice(0, 5);
    }, [tips]);

    // Track previous loading state
    const prevLoading = useRef(true);

    useEffect(() => {
        const isLoading = loadingLessons || loadingCredits || loadingTips;
        // When loading goes from true to false, reset scroll position
        if (prevLoading.current && !isLoading && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
        prevLoading.current = isLoading;
    }, [loadingLessons, loadingCredits, loadingTips]);

    return (
        <>
            <Header
                backgroundImage={bg}
                title={'SWING ESSENTIALS'}
                subtitle={'The pro in your pocket'}
                mainAction={'menu'}
                {...headerProps}
            />

            <ScrollView
                ref={scrollViewRef}
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingLessons || loadingCredits || loadingTips}
                        onRefresh={(): void => {
                            dispatch(loadUserData());
                        }}
                        tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
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
                            onPress={(): void => {
                                router.push('/(auth)/register');
                            }}
                        />
                        <SEButton
                            mode={'contained'}
                            title={'Sign In'}
                            style={{ flex: 1 }}
                            onPress={(): void => {
                                router.push('/login');
                            }}
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
                            onPress={(): void => {
                                router.push('/lessons');
                            }}
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
                            onPress={(): void => {
                                router.push('/order');
                            }}
                        />
                    }
                    style={{
                        marginTop: theme.spacing.xxl,
                        marginHorizontal: theme.spacing.md,
                    }}
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
                    <Typography
                        variant={'bodyLarge'}
                        color={theme.dark ? 'onPrimary' : 'primary'}
                    >{`Credit${credits !== 1 ? 's' : ''} Remaining`}</Typography>
                    {credits > 0 && (
                        <SEButton
                            mode={'outlined'}
                            title={'Submit a Swing'}
                            style={{ marginTop: theme.spacing.md }}
                            onPress={(): void => {
                                router.push('/(drawer)/(screens)/(submit)');
                            }}
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
                                    onPress={(): void => {
                                        router.push('/(drawer)/(screens)/tips');
                                    }}
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
}
