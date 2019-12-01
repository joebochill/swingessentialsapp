import * as React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Body, H7 } from '@pxblue/react-native-components';

import { CollapsibleHeaderLayout, YouTube, SEVideo } from '../../../components/index';

import { width, aspectHeight, aspectWidth, splitParagraphs  } from '../../../utilities';
import { spaces, sharedStyles } from '../../../styles';
import { PlaceholderLesson } from '../../../constants/lessons';

export const SingleLesson = (props) => {
    let lesson = props.navigation.getParam('lesson', null);
    if (lesson === null) lesson = PlaceholderLesson;
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);
    const portraitWidth = (width - 3 * spaces.medium) / 2;
    const portraitHeight = aspectWidth(portraitWidth);

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
                    <>
                        <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                            <H7>Video Analysis</H7>
                        </View>
                        <YouTube
                            videoId={lesson.response_video}
                            style={{ width: videoWidth, height: videoHeight }}
                        />
                        <H7 style={sharedStyles.textTitle}>Comments</H7>
                        {splitParagraphs(lesson.response_notes).map((p, ind) =>
                            <Body key={`${lesson.request_id}_p_${ind}`} style={sharedStyles.paragraph}>{p}</Body>
                        )}
                    </>
                }
                {(Platform.OS === 'ios' && lesson.fo_swing !== '' && lesson.dtl_swing !== '') &&
                    <>
                        <View style={[sharedStyles.sectionHeader, { marginTop: spaces.large, marginHorizontal: 0 }]}>
                            <H7>Your Swing Videos</H7>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <SEVideo
                                source={`https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.fo_swing}`}
                            />
                            <SEVideo
                                style={{ marginLeft: spaces.medium }}
                                source={`https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.dtl_swing}`}
                            />
                        </View>
                    </>
                }
                {lesson.request_notes.length > 0 &&
                    <>
                        <H7 style={sharedStyles.textTitle}>Special Requests</H7>
                        {splitParagraphs(lesson.request_notes).map((p, ind) =>
                            <Body key={`${lesson.request_id}_p_${ind}`} style={sharedStyles.paragraph}>{p}</Body>
                        )}
                    </>
                }
            </View>

        </CollapsibleHeaderLayout >
    )
};