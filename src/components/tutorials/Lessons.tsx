import React from 'react';
import { useTheme, List, Divider } from 'react-native-paper';
// Components
import { View, SectionList } from 'react-native';
import { H7, H4, Body } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { useSharedStyles, useFlexStyles } from '../../styles';
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
// Utilities
import { getLongDate, getDate } from '../../utilities';

export const LessonsTutorial = () => {
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
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
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Your Lessons'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: theme.spaces.small,
                    marginBottom: theme.spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {'When you have submitted your golf swing for analysis, your lessons will appear in this list.'}
            </H7>
            <SectionList
                style={{ marginTop: theme.spaces.large }}
                scrollEnabled={false}
                renderSectionHeader={({ section: { bucketName } }) => (
                    <View style={[sharedStyles.sectionHeader]}>
                        <SEButton
                            mode={'text'}
                            title={bucketName}
                            labelStyle={{ color: theme.colors.onPrimary }}
                            uppercase
                        />
                    </View>
                )}
                sections={sections}
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.date}
                            description={'Remote Lesson'}
                            style={{ backgroundColor: theme.colors.onPrimary }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    {item.new && <Body style={{ marginRight: theme.spaces.small }}>NEW</Body>}
                                    <MatIcon name={'chevron-right'} size={theme.sizes.small} />
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => 'complete_' + item.date}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_lesson_list}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]))}>
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }) => slides[index]}
                    sliderWidth={width - 2 * theme.spaces.medium}
                    itemWidth={width - 2 * theme.spaces.medium}
                />
                <SEButton
                    dark
                    title="GOT IT"
                    style={{ flex: 1, marginTop: theme.spaces.xLarge }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]))}
                />
            </View>
        </TutorialModal>
    );
};
