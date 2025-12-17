import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { LessonTutorial } from '@/components/tutorials/Lesson';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { useGetWelcomeVideoQuery } from '@/redux/apiServices/configurationService';
import { useAppTheme } from '@/theme';
import { height, width } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import { format } from 'date-fns';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlaceholderLessonScreen() {
    const { data: placeholder = { video: '', description: '' } } = useGetWelcomeVideoQuery();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const videoWidth = width - 2 * theme.spacing.md;

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
                title={format(new Date(), 'yyyy-MM-dd')}
                subtitle={'Welcome Lesson'}
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
}
