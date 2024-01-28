import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { CollapsibleHeaderLayout, Typography, YouTube } from '../../components';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
import { width } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadFAQ } from '../../redux/actions';
import { useTheme, Subheading, MD3Theme } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    video: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        video: {
            height: (width - 2 * 8) /*theme.spaces.medium*/ * (9 / 16),
            // marginTop: theme.spaces.xLarge,
        },
    });

export const FAQ: React.FC<StackScreenProps<RootStackParamList, 'FAQ'>> = (props) => {
    const faqState = useSelector((state: ApplicationState) => state.faq);
    const dispatch = useDispatch();
    const theme = useTheme();
    const styles = useStyles(theme);
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);

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
            <View style={[sharedStyles.pageContainer, flexStyles.paddingHorizontal]}>
                {faqState.questions.map((faq, ind) => (
                    <React.Fragment key={`FAQ_${ind}`}>
                        <View
                            style={[
                                sharedStyles.sectionHeader,
                                // { marginTop: ind > 0 ? theme.spaces.jumbo : 0, marginHorizontal: 0 },
                            ]}
                        >
                            <Subheading style={listStyles.heading}>{faq.question}</Subheading>
                        </View>

                        {!faq.platform_specific ? (
                            splitParagraphs(faq.answer).map((p: string, pInd: number) => (
                                <Typography key={`faq-${ind}-${pInd}`} style={[pInd > 0 ? sharedStyles.paragraph : {}]}>
                                    {p}
                                </Typography>
                            ))
                        ) : (
                            <>
                                {Platform.OS === 'ios' &&
                                    splitParagraphs(faq.answer_ios).map((p: string, pInd: number) => (
                                        <Typography
                                            key={`faq-${ind}-${pInd}`}
                                            style={[pInd > 0 ? sharedStyles.paragraph : {}]}
                                        >
                                            {p}
                                        </Typography>
                                    ))}
                                {Platform.OS === 'android' &&
                                    splitParagraphs(faq.answer_android).map((p: string, pInd: number) => (
                                        <Typography
                                            key={`faq-${ind}-${pInd}`}
                                            style={[pInd > 0 ? sharedStyles.paragraph : {}]}
                                        >
                                            {p}
                                        </Typography>
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
