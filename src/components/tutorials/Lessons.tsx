import React, { JSX } from 'react';
import { View, SectionList } from 'react-native';
// import { ListItem, SectionHeader, Stack, Typography } from '../';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
// import Carousel from 'react-native-snap-carousel';
import MatIcon from '@react-native-vector-icons/material-icons';
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { getLongDate, getDate } from '../../utilities';
import { useAppTheme } from '../../theme';
import { SectionHeader, Stack } from '../layout';
import { Typography } from '../typography';
import { ListItem } from '../ListItem';

export const LessonsTutorial: React.FC = () => {
    const showTutorial = { tutorial_lessons: false, tutorial_lesson_list: false }; //useSelector((state: ApplicationState) => state.tutorials);
    const theme = useAppTheme();
    const dispatch = useDispatch();

    const sections = [
        {
            bucketName: getLongDate(Date.now()),
            data: [
                {
                    date: getDate(Date.now()),
                    new: true,
                },
                {
                    date: getDate(Date.now() - 24 * 60 * 60 * 1000),
                    new: false,
                },
            ],
        },
    ];

    const slides = [
        <Stack key={1}>
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Your Lessons'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {'When you have submitted your golf swing for analysis, your lessons will appear in this list.'}
            </Typography>
            <SectionList
                style={{ marginTop: theme.spacing.lg }}
                scrollEnabled={false}
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        titleStyle={{ color: theme.colors.onPrimary }}
                        style={{ marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                renderItem={({ item, index }): JSX.Element => (
                    <ListItem
                        bottomDivider
                        topDivider={index === 0}
                        title={item.date}
                        description={'Remote Lesson'}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                {item.new && (
                                    <Typography
                                        style={{
                                            marginRight: theme.spacing.sm,
                                        }}
                                    >
                                        NEW
                                    </Typography>
                                )}
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                )}
                keyExtractor={(item): string => `complete_${item.date}`}
            />
        </Stack>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_lesson_list}
            onClose={(): void => {
                // dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]));
            }}
        >
            <View>
                {/* <Carousel
                    data={slides}
                    renderItem={({ index }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * theme.spacing.md}
                    itemWidth={width - 2 * theme.spacing.md}
                /> */}
                <SEButton
                    dark
                    mode={'contained'}
                    uppercase
                    buttonColor={theme.colors.secondary}
                    title="GOT IT"
                    style={{ marginTop: theme.spacing.xl }}
                    onPress={(): void => {
                        // dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
