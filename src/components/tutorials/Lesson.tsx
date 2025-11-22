import React, { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent } from 'react-native';
import { TutorialCarousel, TutorialModal } from './';
import { width } from '../../utilities/dimensions';
import { TUTORIAL_KEYS } from '../../_config';
import { useAppTheme } from '../../theme';
import { Stack } from '../layout/Stack';
import { Typography } from '../typography';
import { newTutorialAvailable, setTutorialWatched } from './tutorialsUtilities';

export const LessonTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const slides = [
        <Stack
            key={1}
            align={'center'}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
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

    useEffect(() => {
        const checkTutorialAvailability = async () => {
            const isAvailable = await newTutorialAvailable(TUTORIAL_KEYS.LESSON);
            setShowTutorial(isAvailable);
        };
        checkTutorialAvailability();
    }, []);

    return (
        <TutorialModal
            visible={showTutorial}
            onClose={(): void => {
                setTutorialWatched(TUTORIAL_KEYS.LESSON);
                setShowTutorial(false);
            }}
        >
            <TutorialCarousel
                slides={slides}
                height={carouselHeight || 200} // Fallback to a default height if not calculated yet
                onClose={(): void => {
                    setTutorialWatched(TUTORIAL_KEYS.LESSON);
                    setShowTutorial(false);
                }}
            />
        </TutorialModal>
    );
};
