import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

// Components
import { View, Platform } from 'react-native';
import { Body, H7 } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout, YouTube, SEVideo, VideoCard } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';

// Constants
import { PlaceholderLesson } from '../../constants/lessons';
import { ROUTES } from '../../constants/routes';

// Types
import { ApplicationState } from 'src/__types__';

export const SingleLesson = props => {
    const token = useSelector((state: ApplicationState) => state.login.token);
    let lesson = props.navigation.getParam('lesson', null);
    if (lesson === null) {
        lesson = PlaceholderLesson;
    }
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    useEffect(() => {
        if (!token && lesson.request_id !== -1) props.navigation.pop();
    }, [token, lesson]);

    return !token && lesson.request_id !== -1
        ? null
        : lesson && (
              <CollapsibleHeaderLayout
                  mainAction={'back'}
                  title={lesson.request_date}
                  subtitle={lesson.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}>
                  <View style={sharedStyles.paddingHorizontalMedium}>
                      {lesson.response_video && (
                          <>
                              <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                                  <H7>Video Analysis</H7>
                              </View>
                              <YouTube
                                  videoId={lesson.response_video}
                                  style={{ width: videoWidth, height: videoHeight }}
                              />
                              <H7 style={sharedStyles.textTitle}>Comments</H7>
                              {splitParagraphs(lesson.response_notes).map((p, ind) => (
                                  <Body key={`${lesson.request_id}_p_${ind}`} style={sharedStyles.paragraph}>
                                      {p}
                                  </Body>
                              ))}
                          </>
                      )}
                      {lesson.tips && lesson.tips.length > 0 && (
                          <>
                              <View style={sharedStyles.sectionHeader}>
                                  <H7>Recommended Tips</H7>
                              </View>

                              <Carousel
                                  data={lesson.tips.slice(0, 3)}
                                  renderItem={({ item }) => (
                                      <VideoCard
                                          headerTitle={getLongDate(item.date)}
                                          headerSubtitle={item.title}
                                          style={{ marginBottom: 16 }}
                                          video={item.video}
                                          onExpand={() => props.navigation.push(ROUTES.TIP, { tip: item })}
                                      />
                                  )}
                                  sliderWidth={width}
                                  itemWidth={width - 2 * spaces.medium}
                                  inactiveSlideScale={0.95}
                              />
                          </>
                      )}

                      {Platform.OS === 'ios' && lesson.fo_swing !== '' && lesson.dtl_swing !== '' && (
                          <>
                              <View
                                  style={[
                                      sharedStyles.sectionHeader,
                                      { marginTop: spaces.large, marginHorizontal: 0 },
                                  ]}>
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
                      )}
                      {lesson.request_notes.length > 0 && (
                          <>
                              <H7 style={sharedStyles.textTitle}>Special Requests</H7>
                              {splitParagraphs(lesson.request_notes).map((p, ind) => (
                                  <Body key={`${lesson.request_id}_p_${ind}`} style={sharedStyles.paragraph}>
                                      {p}
                                  </Body>
                              ))}
                          </>
                      )}
                  </View>
              </CollapsibleHeaderLayout>
          );
};
