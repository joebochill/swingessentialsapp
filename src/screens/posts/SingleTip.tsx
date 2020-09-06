import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader, YouTube, SEButton } from '../../components/index';
// Styles
import { useSharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { useTheme } from 'react-native-paper';

export const SingleTip = props => {
    const tip = props.navigation.getParam('tip', null);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);

    if (tip === null) {
        props.navigation.pop();
    }
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    return (
        tip && (
            <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                <SEHeader title={tip.title} subtitle={getLongDate(tip.date)} mainAction={'back'} />
                <ScrollView
                    contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}>
                    <View
                        style={[
                            sharedStyles.sectionHeader,
                            { marginHorizontal: 0 },
                        ]}>
                        <SEButton mode={'text'} title={'Tip Video'} uppercase />
                    </View>
                    <YouTube videoId={tip.video} style={{ width: videoWidth, height: videoHeight }} />
                    <View
                        style={[
                            sharedStyles.sectionHeader,
                            { marginHorizontal: 0, marginTop: theme.spaces.jumbo },
                        ]}>
                        <SEButton mode={'text'} title={'Decription'} uppercase />
                    </View>
                    {splitParagraphs(tip.comments).map((p, ind) => (
                        <Body
                            key={`${tip.id}_p_${ind}`}
                            style={[ind > 0 ? sharedStyles.paragraph : {}]}>
                            {p}
                        </Body>
                    ))}
                </ScrollView>
            </View>
        )
    );
};
