import * as React from 'react';
// Components
import { View } from 'react-native';
import { Body, CollapsibleHeaderLayout, YouTube } from '../../components/index';
// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs} from '../../utilities';

export const SingleTip = props => {
    const tip = props.navigation.getParam('tip', null);
    if (tip === null) {
        props.navigation.popToTop();
    }
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    return (
        tip && (
            <CollapsibleHeaderLayout mainAction={'back'} title={tip.date} subtitle={tip.title}>
                <View style={sharedStyles.paddingHorizontalMedium}>
                    <YouTube videoId={tip.video} style={{ width: videoWidth, height: videoHeight }} />
                    {splitParagraphs(tip.comments).map((p, ind) => (
                        <Body key={`${tip.id}_p_${ind}`} style={sharedStyles.paragraph}>
                            {p}
                        </Body>
                    ))}
                </View>
            </CollapsibleHeaderLayout>
        )
    );
};
