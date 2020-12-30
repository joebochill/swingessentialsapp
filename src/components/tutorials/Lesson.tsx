import React from 'react';
import { useTheme } from 'react-native-paper';
// Components
import { View, Image } from 'react-native';
import { H7, H4 } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';

export const LessonTutorial = () => {
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const dispatch = useDispatch();

    const slides = [
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Swing Analysis'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: theme.spaces.small,
                    marginBottom: theme.spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {
                    'This is where you can view your personalized swing analysis videos. Your analysis will also include comments and recommended tips to improve your game.'
                }
            </H7>
            <Image
                style={{
                    width: '100%',
                    height: (width - 2 * theme.spaces.medium) * (9 / 16),
                }}
                source={{ uri: 'https://img.youtube.com/vi/l3Y3iJa6DvE/0.jpg' }}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_lesson}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON]))}>
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
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON]))}
                />
            </View>
        </TutorialModal>
    );
};
