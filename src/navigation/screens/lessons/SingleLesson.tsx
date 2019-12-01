import * as React from 'react';
import { View } from 'react-native';
import { Body } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout, YouTube } from '../../../components/index';

import { sharedStyles } from '../../../styles';

import { width } from '../../../utilities/dimensions';
import { spaces, aspectHeight } from '../../../styles/sizes';
import { splitParagraphs } from '../../../utilities/general';
import { PlaceholderLesson } from '../../../constants/lessons';

export const SingleLesson = (props) => {
    let lesson = props.navigation.getParam('lesson', null);
    if (lesson === null) lesson = PlaceholderLesson;
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    // TODO: mark viewed
    // TODO: handle deep linking via URL
    // TODO: Lesson type API

    return lesson && (
        <CollapsibleHeaderLayout
            mainAction={'back'}
            title={lesson.request_date}
            subtitle={'Remote Lesson'}
        >
            <View style={sharedStyles.paddingHorizontalMedium}>
                {lesson.response_video &&
                    <><YouTube
                        videoId={lesson.response_video}
                        style={{ width: videoWidth, height: videoHeight }}
                    />
                        {splitParagraphs(lesson.response_notes).map((p, ind) =>
                            <Body key={`${lesson.request_id}_p_${ind}`} style={sharedStyles.paragraph}>{p}</Body>
                        )}
                    </>
                }

            </View>

        </CollapsibleHeaderLayout >
    )
};