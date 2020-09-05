import React from 'react';
import { useTheme } from 'react-native-paper';
// Components
import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, H4, Body } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { useSharedStyles } from '../../styles';
import { sizes, spaces } from '../../styles/sizes';
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
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {'When you have submitted your golf swing for analysis, your lessons will appear in this list.'}
            </H7>
            <SectionList
                style={{ marginTop: spaces.large }}
                scrollEnabled={false}
                renderSectionHeader={({ section: { bucketName } }) => (
                    <H7 style={{ color: theme.colors.onPrimary, marginBottom: spaces.xSmall }}>{bucketName}</H7>
                )}
                sections={sections}
                renderItem={({ item, index }) => (
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        title={<Body>{item.date}</Body>}
                        rightTitle={item.new ? <H7>NEW</H7> : undefined}
                        rightIcon={{
                            name: 'chevron-right',
                            color: theme.colors.text,
                            size: sizes.small,
                        }}
                    />
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
                    sliderWidth={width - 2 * spaces.medium}
                    itemWidth={width - 2 * spaces.medium}
                />
                <SEButton
                    title="GOT IT"
                    style={{ flex: 1, marginTop: spaces.xLarge }}
                    contentStyle={{ backgroundColor: theme.colors.accent }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]))}
                />
            </View>
        </TutorialModal>
    );
};
