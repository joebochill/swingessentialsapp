import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, StyleSheet, Platform } from 'react-native';
import { CollapsibleHeaderLayout } from '../../components';
import { YouTube } from '../../components';
import { Body, H6, H7 } from '@pxblue/react-native-components';

// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadFAQ } from '../../redux/actions';

export const FAQ = () => {
    const faqState = useSelector((state: ApplicationState) => state.faq);
    const dispatch = useDispatch();

    return (
        <CollapsibleHeaderLayout
            title={'FAQ'}
            subtitle={'answers to common questions'}
            refreshing={faqState.loading}
            onRefresh={() => {
                dispatch(loadFAQ());
            }}>
            <View style={[sharedStyles.pageContainer, sharedStyles.paddingHorizontalMedium]}>
                <H6>Frequently Asked Questions</H6>
                {faqState.questions.map((faq, ind) => (
                    <React.Fragment key={`FAQ_${ind}`}>
                        <H7 style={sharedStyles.textTitle}>{faq.question}</H7>
                        {!faq.platform_specific ? (
                            splitParagraphs(faq.answer).map((p: string, pInd: number) => (
                                <Body key={`faq-${ind}-${pInd}`} style={sharedStyles.paragraph}>
                                    {p}
                                </Body>
                            ))
                        ) : (
                            <>
                                {Platform.OS === 'ios' &&
                                    splitParagraphs(faq.answer_ios).map((p: string, pInd: number) => (
                                        <Body key={`faq-${ind}-${pInd}`} style={sharedStyles.paragraph}>
                                            {p}
                                        </Body>
                                    ))}
                                {Platform.OS === 'android' &&
                                    splitParagraphs(faq.answer_android).map((p: string, pInd: number) => (
                                        <Body key={`faq-${ind}-${pInd}`} style={sharedStyles.paragraph}>
                                            {p}
                                        </Body>
                                    ))}
                            </>
                        )}
                        {faq.video === '' ? null : <YouTube videoId={faq.video} style={styles.video} />}
                    </React.Fragment>
                ))}
            </View>
        </CollapsibleHeaderLayout>
    );
};
const styles = StyleSheet.create({
    video: {
        height: (width - 2 * spaces.medium) * (9 / 16),
        marginTop: spaces.small,
    },
});
