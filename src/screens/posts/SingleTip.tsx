import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader, YouTube } from '../../components/index';
// Styles
import { useSharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs } from '../../utilities';
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
                <SEHeader title={tip.date} subtitle={tip.title} mainAction={'back'} />
                <ScrollView
                    contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}>
                    <YouTube videoId={tip.video} style={{ width: videoWidth, height: videoHeight }} />
                    {splitParagraphs(tip.comments).map((p, ind) => (
                        <Body key={`${tip.id}_p_${ind}`} style={sharedStyles.paragraph}>
                            {p}
                        </Body>
                    ))}
                </ScrollView>
            </View>
        )
    );
};
