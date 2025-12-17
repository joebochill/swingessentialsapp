import { TUTORIAL_KEYS } from '@/_config';
import { Stack } from '@/components/layout/Stack';
import { TutorialCarousel, TutorialModal } from '@/components/tutorials/Tutorial';
import { newTutorialAvailable, setTutorialWatched } from '@/components/tutorials/tutorialsUtilities';
import { Typography } from '@/components/typography/Typography';
import { useAppTheme } from '@/theme';
import { width } from '@/utilities/dimensions';
import React, { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent } from 'react-native';

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
                setCarouselHeight((prev) => (height > prev ? height : prev));
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
