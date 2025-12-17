import { BASE_URL } from '@/_config';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { LessonTutorial } from '@/components/tutorials/Lesson';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { SwingVideo } from '@/components/videos/SwingVideo';
import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { useGetLessonByIdQuery, useMarkLessonViewedMutation } from '@/redux/apiServices/lessonsService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { height, width } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function SingleLessonScreen() {
    const router = useRouter();
    const { id: lessonURL } = useLocalSearchParams();

    const token = useSelector((state: RootState) => state.auth.token);
    const isAdmin = useSelector((state: RootState) => state.auth.admin);

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
            router.replace('/lessons');
        }
    }, [token, lessonURL, router]);

    useEffect(() => {
        if (!token && lessonURL) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        }
    }, [token, lessonURL, router]);

    useEffect(() => {
        if (!isAdmin && lessonURL && lessonDetails?.response_video && !lessonDetails?.viewed) {
            markLessonViewed(lessonDetails?.request_id);
        }
    }, [isAdmin, lessonURL, lessonDetails, markLessonViewed]);

    if (!lessonDetails) {
        return null;
    }

    return (
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
                {lessonDetails.fo_swing !== '' && lessonDetails.dtl_swing !== '' && (
                    <>
                        <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.xl }} />
                        <Stack direction={'row'} justify={'space-between'}>
                            <SwingVideo
                                type={'fo'}
                                source={`${BASE_URL}/video_links/${lessonDetails.request_url}/${lessonDetails.fo_swing}`}
                            />
                            <SwingVideo
                                type={'dtl'}
                                source={`${BASE_URL}/video_links/${lessonDetails.request_url}/${lessonDetails.dtl_swing}`}
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
    );
}
