import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { useGetTipByIdQuery } from '@/redux/apiServices/tipsService';
import { useAppTheme } from '@/theme';
import { height, width } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import { format, isValid } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
// import { Paragraph } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SingleTipPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const tipID = typeof id === 'string' ? parseInt(id, 10) : 0;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: tipDetails, isFetching } = useGetTipByIdQuery(tipID ?? 0, {
        skip: tipID === null,
    });

    if (tipID === null) {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    }

    const videoWidth = width - 2 * theme.spacing.md;

    return (
        tipID && (
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
                    title={
                        tipDetails && isValid(new Date(tipDetails.date))
                            ? format(new Date(tipDetails.date), 'MMMM yyyy')
                            : ''
                    }
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
                    {tipDetails && (
                        <>
                            <SectionHeader title={tipDetails.title} />
                            <YoutubeCard video={tipDetails.video} videoWidth={videoWidth} />
                            <SectionHeader title={'Summary'} style={{ marginTop: theme.spacing.xl }} />
                            <Stack gap={theme.spacing.md}>
                                {splitParagraphs(tipDetails.comments).map((p, ind) => (
                                    <Paragraph key={`${tipDetails.id}_p_${ind}`}>{p}</Paragraph>
                                ))}
                            </Stack>
                        </>
                    )}
                    {isFetching && (
                        <>
                            <ActivityIndicator size={'large'} color={theme.colors.onSurface} />
                            <Typography variant={'bodyLarge'} align={'center'} color={'onSurface'}>
                                Loading post...
                            </Typography>
                        </>
                    )}
                </ScrollView>
            </Stack>
        )
    );
}
