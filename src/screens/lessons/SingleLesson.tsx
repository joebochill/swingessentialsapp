import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, ScrollView } from 'react-native';
import { LessonTutorial, Stack, SectionHeader, Paragraph, YoutubeCard } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Styles
import { width, height } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';

// Constants
import { ROUTES } from '../../constants/routes';
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Types
import { ApplicationState } from '../../__types__';

// Actions
import { markLessonViewed } from '../../redux/actions';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../../components/videos/SwingVideo';
import { Header } from '../../components/CollapsibleHeader/Header';

export const SingleLesson: React.FC<StackScreenProps<RootStackParamList, 'Lesson'>> = (props) => {
    const token = useSelector((state: ApplicationState) => state.login.token);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const dispatch = useDispatch();
    const theme = useAppTheme();

    let { lesson } = props.route.params;
    if (lesson === null) {
        lesson = placeholder;
    }
    const videoWidth = width - 2 * theme.spacing.md;

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
            /* @ts-ignore */
            dispatch(markLessonViewed(lesson.request_id));
        }
    }, [dispatch, lesson, role, token]);

    return !token && lesson.request_id !== -1
        ? null
        : lesson && (
              <Stack
                  style={[
                      {
                          flex: 1,
                          backgroundColor: theme.colors.background,
                          paddingTop: HEADER_COLLAPSED_HEIGHT,
                      },
                  ]}
              >
                  <Header
                      title={lesson.request_date}
                      subtitle={lesson.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}
                      mainAction={'back'}
                      navigation={props.navigation}
                      fixed
                  />
                  <ScrollView
                      contentContainerStyle={[
                          {
                              paddingHorizontal: theme.spacing.md,
                              paddingTop: theme.spacing.md,
                              paddingBottom: height * 0.5,
                          },
                      ]}
                      keyboardShouldPersistTaps={'always'}
                  >
                      {lesson.response_video && (
                          <>
                              <SectionHeader title={'Video Analysis'} />
                              <YoutubeCard video={lesson.response_video} videoWidth={videoWidth} />
                              <SectionHeader title={'Comments'} style={{ marginTop: theme.spacing.xl }} />
                              <Stack space={theme.spacing.md}>
                                  {splitParagraphs(lesson.response_notes).map((p, ind) => (
                                      <Paragraph key={`${lesson.request_id}_p_${ind}`}>{p}</Paragraph>
                                  ))}
                              </Stack>
                          </>
                      )}
                      {/* @ts-ignore */}
                      {lesson.tips && lesson.tips.length > 0 && (
                          <>
                              <SectionHeader title={'Recommended Tips'} style={{ marginTop: theme.spacing.xl }} />
                              <Carousel
                                  // @ts-ignore
                                  data={lesson.tips.slice(0, 3)}
                                  renderItem={({ item }: { item: any }): JSX.Element => (
                                      <YoutubeCard
                                          headerTitle={getLongDate(item.date)}
                                          headerSubtitle={item.title}
                                          video={item.video}
                                          // @ts-ignore
                                          onExpand={(): void => props.navigation.push(ROUTES.TIP, { tip: item })}
                                      />
                                  )}
                                  sliderWidth={width}
                                  itemWidth={width - 2 * theme.spacing.md}
                                  inactiveSlideScale={0.95}
                                  containerCustomStyle={{ marginHorizontal: -1 * theme.spacing.md }}
                              />
                          </>
                      )}

                      {Platform.OS === 'ios' && lesson.fo_swing !== '' && lesson.dtl_swing !== '' && (
                          <>
                              <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.xl }} />
                              <Stack direction={'row'} justify={'space-between'}>
                                  <SwingVideo
                                      type={'fo'}
                                      source={{
                                          uri: `https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.fo_swing}`,
                                      }}
                                  />
                                  <SwingVideo
                                      type={'dtl'}
                                      source={{
                                          uri: `https://www.swingessentials.com/video_links/${lesson.request_url}/${lesson.dtl_swing}`,
                                      }}
                                  />
                              </Stack>
                          </>
                      )}
                      {lesson.request_notes.length > 0 && (
                          <>
                              <SectionHeader title={'Your Special Requests'} style={{ marginTop: theme.spacing.xl }} />
                              <Stack space={theme.spacing.md}>
                                  {splitParagraphs(lesson.request_notes).map((p, ind) => (
                                      <Paragraph key={`${lesson.request_id}_p_${ind}`}>{p}</Paragraph>
                                  ))}
                              </Stack>
                          </>
                      )}
                  </ScrollView>
                  <LessonTutorial />
              </Stack>
          );
};
