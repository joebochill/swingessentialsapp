import React from 'react';
import { useTheme, List, Divider, Subheading } from 'react-native-paper';
// Components
import { View, SectionList } from 'react-native';
import { Typography } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
// Utilities
import { getLongDate, getDate } from '../../utilities';

export const LessonsTutorial: React.FC = () => {
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);
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
            <Typography
                variant={'displayMedium'}
                fontWeight={'semiBold'}
                color={'onPrimary'}
                style={{ textAlign: 'center' }}
            >
                {'Your Lessons'}
            </Typography>
            <Typography
                fontWeight={'light'}
                color={'onPrimary'}
                style={{
                    textAlign: 'center',
                    // marginTop: theme.spaces.small,
                    // marginBottom: theme.spaces.medium,
                }}
            >
                {'When you have submitted your golf swing for analysis, your lessons will appear in this list.'}
            </Typography>
            <SectionList
                // style={{ marginTop: theme.spaces.large }}
                scrollEnabled={false}
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <View style={[sharedStyles.sectionHeader]}>
                        <Subheading style={[listStyles.heading, { color: theme.colors.onPrimary }]}>
                            {bucketName}
                        </Subheading>
                    </View>
                )}
                sections={sections}
                renderItem={({ item, index }): JSX.Element => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.date}
                            description={'Remote Lesson'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    {item.new && (
                                        <Typography
                                            style={
                                                {
                                                    /*marginRight: theme.spaces.small*/
                                                }
                                            }
                                        >
                                            NEW
                                        </Typography>
                                    )}
                                    <MatIcon
                                        name={'chevron-right'}
                                        // size={theme.sizes.small}
                                        style={{ marginRight: -1 * 4 /*theme.spaces.small*/ }}
                                    />
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => `complete_${item.date}`}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_lesson_list}
            onClose={(): void => {
                // @ts-ignore
                dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]));
            }}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * 8 /*theme.spaces.medium*/}
                    itemWidth={width - 2 * 8 /*theme.spaces.medium*/}
                />
                <SEButton
                    dark
                    title="GOT IT"
                    style={{ flex: 1 /*marginTop: theme.spaces.xLarge*/ }}
                    onPress={(): void => {
                        // @ts-ignore
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON_LIST]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
