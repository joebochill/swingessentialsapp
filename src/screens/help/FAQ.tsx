import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { Paragraph, SectionHeader, Stack, YoutubeCard } from '../../components';

// Styles
import { width } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadFAQ } from '../../redux/actions';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { EXPANDED_HEIGHT, Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';

export const FAQ: React.FC<StackScreenProps<RootStackParamList, 'FAQ'>> = (props) => {
    const faqState = useSelector((state: ApplicationState) => state.faq);
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    return (
        <>
            <Header
                title={'FAQ'}
                subtitle={'Answers to common questions'}
                navigation={props.navigation}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={faqState.loading}
                        // @ts-ignore
                        onRefresh={(): void => {
                            dispatch(loadFAQ());
                        }}
                        progressViewOffset={EXPANDED_HEIGHT}
                    />
                }
            >
                <Stack
                    space={theme.spacing.xxl}
                    style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}
                >
                    {faqState.questions.map((faq, ind) => (
                        <Stack key={`FAQ_${ind}`}>
                            <SectionHeader title={faq.question} />
                            <Stack space={theme.spacing.md}>
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
