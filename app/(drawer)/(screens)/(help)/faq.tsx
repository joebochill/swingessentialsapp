import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { useGetFAQsQuery } from '@/redux/apiServices/faqService';
import { useAppTheme } from '@/theme';
import { width } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import * as React from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';

export default function FAQScreen() {
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: faqs = [], isFetching, refetch } = useGetFAQsQuery();

    return (
        <>
            <Header
                title={'FAQ'}
                subtitle={'Answers to common questions'}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={(): void => {
                            refetch();
                        }}
                        tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                <Stack
                    gap={theme.spacing.xxl}
                    style={{
                        paddingHorizontal: theme.spacing.md,
                        marginTop: theme.spacing.md,
                    }}
                >
                    {faqs.map((faq: any, ind: number) => (
                        <Stack key={`FAQ_${ind}`}>
                            <SectionHeader title={faq.question} />
                            <Stack gap={theme.spacing.md}>
                                {splitParagraphs(
                                    !faq.platform_specific
                                        ? faq.answer
                                        : Platform.OS === 'ios'
                                          ? faq.answer_ios
                                          : Platform.OS === 'android'
                                            ? faq.answer_android
                                            : ''
                                ).map((p: string, pInd: number) => (
                                    <Paragraph key={`faq-${ind}-${pInd}`}>{p}</Paragraph>
                                ))}
                            </Stack>
                            {faq.video === '' ? null : (
                                <YoutubeCard
                                    video={faq.video}
                                    videoWidth={width - 2 * theme.spacing.md}
                                    style={{
                                        height: (width - 2 * theme.spacing.md) * (9 / 16),
                                        marginTop: theme.spacing.xl,
                                        borderRadius: theme.roundness,
                                    }}
                                />
                            )}
                        </Stack>
                    ))}
                </Stack>
            </ScrollView>
        </>
    );
}
