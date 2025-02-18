import React from 'react';

// Components
import { View, Image } from 'react-native';
import { Stack, Typography } from '../';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { useAppTheme } from '../../theme';

export const LessonTutorial: React.FC = () => {
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useAppTheme();
    const dispatch = useDispatch();

    const slides = [
        <Stack key={1} align={'center'}>
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Swing Analysis'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {
                    'This is where you can view your personalized swing analysis videos. Your analysis will also include comments and recommended tips to improve your game.'
                }
            </Typography>
            <Image
                style={{
                    width: '100%',
                    height: (width - 2 * theme.spacing.md) * (9 / 16),
                    marginTop: theme.spacing.lg,
                }}
                source={{ uri: 'https://img.youtube.com/vi/OoW6v6LDqfM/0.jpg' }}
            />
        </Stack>,
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
                    sliderWidth={width - 2 * theme.spacing.md}
                    itemWidth={width - 2 * theme.spacing.md}
                />
                <SEButton
                    dark
                    mode={'contained'}
                    uppercase
                    buttonColor={theme.colors.secondary}
                    title="GOT IT"
                    style={{ marginTop: theme.spacing.xl }}
                    onPress={(): void => {
                        // @ts-ignore
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.LESSON]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
