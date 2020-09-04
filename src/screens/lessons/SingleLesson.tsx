import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, Platform, ScrollView } from 'react-native';
import { Body, H7, SEHeader, YouTube, SEVideo, VideoCard, LessonTutorial } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';

// Constants
import { ROUTES } from '../../constants/routes';
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Types
import { ApplicationState, Lesson } from 'src/__types__';

// Actions
import { markLessonViewed } from '../../redux/actions';

export const SingleLesson = props => {
    const token = useSelector((state: ApplicationState) => state.login.token);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const dispatch = useDispatch();

    let lesson: Lesson = props.navigation.getParam('lesson', null);
    if (lesson === null) {
        lesson = placeholder;
    }
    const videoWidth = width - 2 * spaces.medium;
    const videoHeight = aspectHeight(videoWidth);

    useEffect(() => {
        if (!token && lesson.request_id !== -1) {
            props.navigation.pop();
        }
    }, [token, lesson, props.navigation]);

    useEffect(() => {
        if (lesson.request_id === -1) {
            return;
        }
        const viewed = typeof lesson.viewed === 'string' ? parseInt(lesson.viewed, 10) === 1 : lesson.viewed === 1;
        if (!viewed && token && role !== 'administrator') {
            dispatch(markLessonViewed(lesson.request_id));
        }
    }, [dispatch, lesson, role, token]);

    return !token && lesson.request_id !== -1
        ? null
        : lesson && (
              <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                  <SEHeader
                      title={lesson.request_date}
                      subtitle={lesson.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}
                      mainAction={'back'}
                  />
                  <ScrollView
                      contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                      keyboardShouldPersistTaps={'always'}>
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
                                          style={{ marginBottom: spaces.medium }}
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
                  </ScrollView>
                  <LessonTutorial />
              </View>
          );
};
