import * as React from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { SEHeader } from '../../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { spaces } from '../../../styles/sizes';
import { YouTube } from '../../../components';
import { width } from '../../../utilities/dimensions';
import { Body, H6, H7 } from '@pxblue/react-native-components';
import { FAQData } from '../../../data/FAQ';
import { splitParagraphs } from '../../../utilities/general';

export const FAQ = (props) => (
    <View style={styles.container}>
        <SEHeader title={'FAQ'} subtitle={'...common questions'} />
        <ScrollView contentContainerStyle={{ padding: spaces.medium }}>
            <H6>Frequently Asked Questions</H6>
            {FAQData.map((faq) => (
                <>
                    <H7 style={styles.title}>{faq.question}</H7>
                    {!faq.platform_specific ?
                        (splitParagraphs(faq.answer).map((p: string) => (
                            <Body style={styles.paragraph}>{p}</Body>)
                        )) :
                        (<>
                            {Platform.OS === 'ios' && splitParagraphs(faq.answer_ios).map((p: string) => (
                                <Body style={styles.paragraph}>{p}</Body>
                            ))}
                            {Platform.OS === 'android' && splitParagraphs(faq.answer_android).map((p: string) => (
                                <Body style={styles.paragraph}>{p}</Body>
                            ))}
                        </>)
                    }
                    {faq.video === '' ? null :
                        <YouTube videoId={faq.video} style={styles.video}/>
                    }
                </>
            ))}
            <SafeAreaView />
        </ScrollView>
    </View>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title:{
        marginTop: spaces.medium,
    },
    paragraph:{
        marginTop: spaces.small,
    },
    video: {
        height: (width - 2 * spaces.medium) * (9 / 16),
        marginTop: spaces.small,
    }
});
