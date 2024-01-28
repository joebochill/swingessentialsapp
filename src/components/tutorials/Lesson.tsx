import React from 'react';
import { useTheme } from 'react-native-paper';
// Components
import { View, Image } from 'react-native';
import { Typography } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';

export const LessonTutorial: React.FC = () => {
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const dispatch = useDispatch();

    const slides = [
        <>
            <Typography
                variant={'displayMedium'}
                fontWeight={'semiBold'}
                color={'onPrimary'}
                style={{ textAlign: 'center' }}
            >
                {'Swing Analysis'}
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
                {
                    'This is where you can view your personalized swing analysis videos. Your analysis will also include comments and recommended tips to improve your game.'
                }
            </Typography>
            <Image
                style={{
                    width: '100%',
                    height: (width - 2 * 8) /*theme.spaces.medium*/ * (9 / 16),
                }}
                source={{ uri: 'https://img.youtube.com/vi/l3Y3iJa6DvE/0.jpg' }}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_lesson}
            onClose={(): void => {
                // @ts-ignore
                dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON]));
            }}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }: { index: number }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * 8 /*theme.spaces.medium*/}
                    itemWidth={width - 2 * 8 /*theme.spaces.medium*/}
                />
                <SEButton
                    dark
                    title="GOT IT"
                    style={{ flex: 1 /*marginTop: theme.spaces.xLarge*/ }}
                    onPress={(): void => {
                        // @ts-ignore
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
