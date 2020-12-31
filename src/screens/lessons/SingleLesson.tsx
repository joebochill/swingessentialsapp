import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, Platform, ScrollView } from 'react-native';
import { Body, SEHeader, YouTube, SEVideo, VideoCard, LessonTutorial } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';

// Constants
import { ROUTES } from '../../constants/routes';
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Types
import { ApplicationState } from 'src/__types__';

// Actions
import { markLessonViewed } from '../../redux/actions';
import { useTheme, Subheading } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

export const SingleLesson: React.FC<StackScreenProps<RootStackParamList, 'Lesson'>> = (props) => {
    const token = useSelector((state: ApplicationState) => state.login.token);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);

    let { lesson } = props.route.params;
    if (lesson === null) {
        lesson = placeholder;
    }
    const videoWidth = width - 2 * theme.spaces.medium;
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
                      contentContainerStyle={[flexStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                      keyboardShouldPersistTaps={'always'}
                  >
                      {lesson.response_video && (
                          <>
                              <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                                  <Subheading style={listStyles.heading}>{'Video Analysis'}</Subheading>
                              </View>
                              <YouTube
                                  videoId={lesson.response_video}
                                  style={{ width: videoWidth, height: videoHeight, backgroundColor: 'magenta' }}
                              />
                              <View
                                  style={[
                                      sharedStyles.sectionHeader,
                                      { marginHorizontal: 0, marginTop: theme.spaces.jumbo },
                                  ]}
                              >
                                  <Subheading style={listStyles.heading}>{'Comments'}</Subheading>
                              </View>
                              {splitParagraphs(lesson.response_notes).map((p, ind) => (
                                  <Body
                                      key={`${lesson.request_id}_p_${ind}`}
                                      style={[ind > 0 ? sharedStyles.paragraph : {}]}
                                  >
                                      {p}
                                  </Body>
                              ))}
                          </>
                      )}
                      {lesson.tips && lesson.tips.length > 0 && (
                          <>
                              <View
                                  style={[
                                      sharedStyles.sectionHeader,
                                      { marginHorizontal: 0, marginTop: theme.spaces.jumbo },
                                  ]}
                              >
                                  <Subheading style={listStyles.heading}>{'Recommended Tips'}</Subheading>
                              </View>

                              <Carousel
                                  data={lesson.tips.slice(0, 3)}
                                  renderItem={({ item }) => (
                                      <VideoCard
                                          headerTitle={getLongDate(item.date)}
                                          headerSubtitle={item.title}
                                          style={{ marginBottom: theme.spaces.medium }}
                                          video={item.video}
                                          onExpand={() => props.navigation.push(ROUTES.TIP, { tip: item })}
                                      />
                                  )}
                                  sliderWidth={width}
                                  itemWidth={width - 2 * theme.spaces.medium}
                                  inactiveSlideScale={0.95}
                              />
                          </>
                      )}

                      {Platform.OS === 'ios' && lesson.fo_swing !== '' && lesson.dtl_swing !== '' && (
                          <>
                              <View
                                  style={[
                                      sharedStyles.sectionHeader,
                                      { marginHorizontal: 0, marginTop: theme.spaces.jumbo },
                                  ]}
                              >
                                  <Subheading style={listStyles.heading}>{'Your Swing Videos'}</Subheading>
                              </View>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <SEVideo
                                      source={`https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.fo_swing}`}
                                  />
                                  <SEVideo
                                      style={{ marginLeft: theme.spaces.medium }}
                                      source={`https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.dtl_swing}`}
                                  />
                              </View>
                          </>
                      )}
                      {lesson.request_notes.length > 0 && (
                          <>
                              <View
                                  style={[
                                      sharedStyles.sectionHeader,
                                      { marginHorizontal: 0, marginTop: theme.spaces.jumbo },
                                  ]}
                              >
                                  <Subheading style={listStyles.heading}>{'Your Special Requests'}</Subheading>
                              </View>
                              {splitParagraphs(lesson.request_notes).map((p, ind) => (
                                  <Body
                                      key={`${lesson.request_id}_p_${ind}`}
                                      style={[ind > 0 ? sharedStyles.paragraph : {}]}
                                  >
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
