import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform } from 'react-native';
import { CollapsibleHeaderLayout, Paragraph, SectionHeader, Stack, YouTube } from '../../components';

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
import { useAppTheme } from '../../styles/theme';

export const FAQ: React.FC<StackScreenProps<RootStackParamList, 'FAQ'>> = (props) => {
    const faqState = useSelector((state: ApplicationState) => state.faq);
    const dispatch = useDispatch();
    const theme = useAppTheme();

    return (
        <CollapsibleHeaderLayout
            title={'FAQ'}
            subtitle={'Answers to common questions'}
            refreshing={faqState.loading}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadFAQ());
            }}
            navigation={props.navigation}
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
                            <YouTube
                                videoId={faq.video}
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
        </CollapsibleHeaderLayout>
    );
};
