import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, RefreshControl, ScrollView } from 'react-native';

// Styles
import { width } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';

import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { Paragraph } from '../../components/typography';
import { YoutubeCard } from '../../components/videos';

export const FAQ: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const faqState = {} as any; //useSelector((state: ApplicationState) => state.faq);
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    return (
        <>
            <Header title={'FAQ'} subtitle={'Answers to common questions'} navigation={navigation} {...headerProps} />
            <ScrollView
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={faqState.loading}
                        onRefresh={(): void => {
                            // dispatch(loadFAQ());
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                <Stack
                    gap={theme.spacing.xxl}
                    style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}
                >
                    {faqState.questions.map((faq: any, ind: number) => (
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
