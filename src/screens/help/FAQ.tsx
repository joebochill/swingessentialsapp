import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, RefreshControl, ScrollView } from 'react-native';

// Styles
import { width } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';

import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { Paragraph } from '../../components/typography';
import { YoutubeCard } from '../../components/videos';
import { useGetFAQsQuery } from '../../redux/apiServices/faqService';

export const FAQ: React.FC = () => {
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const { data: faqs = [], isFetching, refetch } = useGetFAQsQuery();

    return (
        <>
            <Header
                title={'FAQ'}
                subtitle={'Answers to common questions'}
                navigation={navigation}
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
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                <Stack
                    gap={theme.spacing.xxl}
                    style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}
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
};
