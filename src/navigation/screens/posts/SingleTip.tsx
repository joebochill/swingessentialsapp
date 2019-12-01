import * as React from 'react';
import { View } from 'react-native';
import { Body } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout, YouTube } from '../../../components/index';

import { sharedStyles } from '../../../styles';

import { width } from '../../../utilities/dimensions';
import { spaces, aspectHeight } from '../../../styles/sizes';
import { splitParagraphs } from '../../../utilities/general';

export const SingleTip = (props) => {
    const tip = props.navigation.getParam('tip', null);
    if (tip === null) props.navigation.popToTop();
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    return tip && (
        <CollapsibleHeaderLayout
            mainAction={'back'}
            title={tip.date}
            subtitle={tip.title}
        >
            <View style={sharedStyles.paddingHorizontalMedium}>
                <YouTube
                    videoId={tip.video}
                    style={{ width: videoWidth, height: videoHeight }}
                />
                {splitParagraphs(tip.comments).map((p, ind) =>
                    <Body key={`${tip.id}_p_${ind}`} style={sharedStyles.paragraph}>{p}</Body>
                )}
            </View>

        </CollapsibleHeaderLayout >
    )
};