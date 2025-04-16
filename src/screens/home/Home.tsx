import React, { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RefreshControl, View, ScrollView } from 'react-native';
import { ROUTES } from '../../constants/routes';
import bg from '../../images/banners/landing.jpg';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { Header } from '../../components/CollapsibleHeader/Header';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader, Stack } from '../../components/layout';
import { SEButton } from '../../components/SEButton';
import { Typography } from '../../components/typography';
import { HomeTutorial } from '../../components/tutorials';
import { RootState } from '../../redux/store';
import { useGetCreditsQuery } from '../../redux/apiServices/creditsService';
import { useGetTipsQuery } from '../../redux/apiServices/tipsService';
import { useGetCompletedLessonsQuery } from '../../redux/apiServices/lessonsService';
import { useGetWelcomeVideoQuery } from '../../redux/apiServices/configurationService';
import { loadUserData } from '../../redux/thunks';
import { LessonCarousel } from '../../components/videos/LessonCarousel';
import { VideoCarousel } from '../../components/videos/VideoCarousel';

export const Home: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const {
        data: { data: lessons = [] } = {},
        isFetching: loadingLessons,
        isUninitialized,
    } = useGetCompletedLessonsQuery({ page: 1, users: '' }, { skip: !token });
    const { data: tips = [], isFetching: loadingTips, isSuccess: haveTips } = useGetTipsQuery();
    const { data: placeholder = { video: '', description: '' }, isFetching, error } = useGetWelcomeVideoQuery();

    const {
        data: { count: credits = 0 } = {},
        isUninitialized: creditsUninitialized,
        isFetching: loadingCredits,
    } = useGetCreditsQuery(undefined, { skip: !token });

    const latestLessons = lessons.length > 0 ? lessons : [placeholder];

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
                    style={{ marginTop: theme.spacing.md, marginHorizontal: theme.spacing.md }}
                />

                <LessonCarousel data={latestLessons.slice(0, role === 'administrator' ? 5 : 3)} />

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
                    style={{ marginTop: theme.spacing.md, marginHorizontal: theme.spacing.md }}
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
                            icon={'upload'}
                            style={{ marginTop: theme.spacing.md }}
                            onPress={(): void => navigation.navigate(ROUTES.SUBMIT)}
                        />
                    )}
                </Stack>

                {/* TIP OF THE MONTH */}
                {tips.length > 0 && (
                    <View style={{ marginTop: theme.spacing.md }}>
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

                        <VideoCarousel data={tips.slice(0, 3)} />
                    </View>
                )}
            </ScrollView>
            {/* <HomeTutorial /> */}
        </>
    );
};
