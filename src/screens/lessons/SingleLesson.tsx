import React, { JSX, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, ScrollView } from 'react-native';
// import Carousel from 'react-native-snap-carousel';

// Styles
import { width, height } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';

// Constants
import { ROUTES } from '../../constants/routes';

// Actions
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../../components/videos/SwingVideo';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { YoutubeCard } from '../../components/videos';
import { Paragraph } from '../../components/typography';
import { LessonTutorial } from '../../components/tutorials';

export const SingleLesson: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const token: string = ''; //useSelector((state: ApplicationState) => state.login.token);
    const role: string = ''; //useSelector((state: ApplicationState) => state.login.role);
    const placeholder = {} as any; //useSelector((state: ApplicationState) => state.config.placeholder);
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    let { lesson } = route.params;
    if (lesson === null) {
        lesson = placeholder;
    }
    const videoWidth = width - 2 * theme.spacing.md;

    useEffect(() => {
        if (!token && lesson.request_id !== -1) {
            // navigation.pop();
        }
    }, [token, lesson, navigation]);

    useEffect(() => {
        if (lesson.request_id === -1) {
            return;
        }
        const viewed = typeof lesson.viewed === 'string' ? parseInt(lesson.viewed, 10) === 1 : lesson.viewed === 1;
        if (!viewed && token && role !== 'administrator') {
            // dispatch(markLessonViewed(lesson.request_id));
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
                          paddingTop: COLLAPSED_HEIGHT + insets.top,
                      },
                  ]}
              >
                  <Header
                      title={lesson.request_date}
                      subtitle={lesson.type === 'in-person' ? 'In-Person Lesson' : 'Remote Lesson'}
                      mainAction={'back'}
                      navigation={navigation}
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
                              <Stack gap={theme.spacing.md}>
                                  {splitParagraphs(lesson.response_notes).map((p, ind) => (
                                      <Paragraph key={`${lesson.request_id}_p_${ind}`}>{p}</Paragraph>
                                  ))}
                              </Stack>
                          </>
                      )}
                      {lesson.tips && lesson.tips.length > 0 && (
                          <>
                              <SectionHeader title={'Recommended Tips'} style={{ marginTop: theme.spacing.xl }} />
                              {/* <Carousel
                                  data={lesson.tips.slice(0, 3)}
                                  renderItem={({ item }: { item: any }): JSX.Element => (
                                      <YoutubeCard
                                          headerTitle={getLongDate(item.date)}
                                          headerSubtitle={item.title}
                                          video={item.video}
                                        //   onExpand={(): void => navigation.push(ROUTES.TIP, { tip: item })}
                                      />
                                  )}
                                  sliderWidth={width}
                                  itemWidth={width - 2 * theme.spacing.md}
                                  inactiveSlideScale={0.95}
                                  containerCustomStyle={{
                                      marginHorizontal: -1 * theme.spacing.md,
                                      overflow: 'visible',
                                  }}
                              /> */}
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
                              <Stack gap={theme.spacing.md}>
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
