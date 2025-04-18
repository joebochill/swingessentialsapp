import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Platform, ScrollView } from 'react-native';
import { width, height } from '../../utilities/dimensions';
import { splitParagraphs } from '../../utilities';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../../components/videos/SwingVideo';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { YoutubeCard } from '../../components/videos';
import { Paragraph } from '../../components/typography';
import { LessonTutorial } from '../../components/tutorials';
import { RootState } from '../../redux/store';
import { useGetWelcomeVideoQuery } from '../../redux/apiServices/configurationService';
import { useGetLessonByIdQuery, useMarkLessonViewedMutation } from '../../redux/apiServices/lessonsService';
import { format } from 'date-fns';
import { BASE_URL } from '../../constants';

export const SingleLesson: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'LESSON'>>();
    const { lesson: lessonURL } = route.params;

    const token = useSelector((state: RootState) => state.auth.token);
    const isAdmin = useSelector((state: RootState) => state.auth.admin);

    const { data: placeholder = { video: '', description: '' } } = useGetWelcomeVideoQuery();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: { details: lessonDetails } = {} } = useGetLessonByIdQuery(
        { id: lessonURL as string | number, users: '' },
        {
            skip: !lessonURL,
        }
    );
    const [markLessonViewed] = useMarkLessonViewedMutation();

    const videoWidth = width - 2 * theme.spacing.md;

    useEffect(() => {
        if (!token && lessonURL) {
            navigation.pop();
        }
    }, [token, lessonURL, navigation]);

    useEffect(() => {
        if (!isAdmin && lessonURL && lessonDetails?.response_video && !lessonDetails?.viewed) {
            markLessonViewed(lessonDetails?.request_id);
        }
    }, [isAdmin, lessonURL, lessonDetails, markLessonViewed]);

    return !token && lessonURL ? null : lessonDetails ? (
        <Stack
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingTop: COLLAPSED_HEIGHT + insets.top,
                },
            ]}
        >
            <Header
                title={format(new Date(lessonDetails.request_date), 'yyyy-MM-dd')}
                subtitle={lessonDetails.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}
                mainAction={'back'}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <ScrollView
                contentContainerStyle={[
                    {
                        paddingHorizontal: theme.spacing.md,
                        paddingTop: theme.spacing.md,
                        paddingBottom: height * 0.5,
                    },
                ]}
                keyboardShouldPersistTaps={'always'}
            >
                {lessonDetails.response_video && (
                    <>
                        <SectionHeader title={'Video Analysis'} />
                        <YoutubeCard video={lessonDetails.response_video} videoWidth={videoWidth} />
                        <SectionHeader title={'Comments'} style={{ marginTop: theme.spacing.xl }} />
                        <Stack gap={theme.spacing.md}>
                            {splitParagraphs(lessonDetails.response_notes).map((p, ind) => (
                                <Paragraph key={`${lessonDetails.request_id}_p_${ind}`}>{p}</Paragraph>
                            ))}
                        </Stack>
                    </>
                )}

                {Platform.OS === 'ios' && lessonDetails.fo_swing !== '' && lessonDetails.dtl_swing !== '' && (
                    <>
                        <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.xl }} />
                        <Stack direction={'row'} justify={'space-between'}>
                            <SwingVideo
                                type={'fo'}
                                source={{
                                    uri: `${BASE_URL}/video_links/${lessonDetails.request_url}/${lessonDetails.fo_swing}`,
                                }}
                            />
                            <SwingVideo
                                type={'dtl'}
                                source={{
                                    uri: `${BASE_URL}/video_links/${lessonDetails.request_url}/${lessonDetails.dtl_swing}`,
                                }}
                            />
                        </Stack>
                    </>
                )}
                {lessonDetails.request_notes.length > 0 && (
                    <>
                        <SectionHeader title={'Your Special Requests'} style={{ marginTop: theme.spacing.xl }} />
                        <Stack gap={theme.spacing.md}>
                            {splitParagraphs(lessonDetails.request_notes).map((p, ind) => (
                                <Paragraph key={`${lessonDetails.request_id}_p_${ind}`}>{p}</Paragraph>
                            ))}
                        </Stack>
                    </>
                )}
            </ScrollView>
            <LessonTutorial />
        </Stack>
    ) : (
        // PLACEHOLDER
        <Stack
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingTop: COLLAPSED_HEIGHT + insets.top,
                },
            ]}
        >
            <Header
                title={format(new Date(), 'yyyy-MM-dd')}
                subtitle={'Welcome Lesson'}
                mainAction={'back'}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <ScrollView
                contentContainerStyle={[
                    {
                        paddingHorizontal: theme.spacing.md,
                        paddingTop: theme.spacing.md,
                        paddingBottom: height * 0.5,
                    },
                ]}
                keyboardShouldPersistTaps={'always'}
            >
                {placeholder.video && (
                    <>
                        <SectionHeader title={'Video Analysis'} />
                        <YoutubeCard video={placeholder.video} videoWidth={videoWidth} />
                        <SectionHeader title={'Comments'} style={{ marginTop: theme.spacing.xl }} />
                        <Stack gap={theme.spacing.md}>
                            {splitParagraphs(placeholder.description).map((p, ind) => (
                                <Paragraph key={`p_${ind}`}>{p}</Paragraph>
                            ))}
                        </Stack>
                    </>
                )}
            </ScrollView>
            <LessonTutorial />
        </Stack>
    );
};
