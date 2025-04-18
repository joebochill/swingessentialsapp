import React, { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { TutorialCarousel, TutorialModal } from './Tutorial';
import { useAppTheme } from '../../theme';
import { Stack } from '../layout/Stack';
import { Typography } from '../typography';
import { Icon } from '../common/Icon';
import { newTutorialAvailable, setTutorialWatched } from './tutorialsUtilities';
import { TUTORIAL_KEYS } from '../../_config';

export const HomeTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const slides = [
        <View
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
            <Stack>
                <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                    {'Welcome to Swing Essentials®!'}
                </Typography>
                <Typography
                    variant={'bodyMedium'}
                    fontWeight={'light'}
                    color={'onPrimary'}
                    align={'center'}
                    style={{ marginTop: theme.spacing.sm }}
                >
                    {
                        'The Swing Essentials app gives you quick access to everything you need to keep improving your swing.'
                    }
                </Typography>
            </Stack>
        </View>,
        <View
            key={2}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
            <Stack align={'center'}>
                <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                    {'Sign Up Today'}
                </Typography>
                <Typography
                    variant={'bodyMedium'}
                    fontWeight={'light'}
                    color={'onPrimary'}
                    align={'center'}
                    style={{
                        marginTop: theme.spacing.sm,
                    }}
                >
                    {'You can sign in or register for an account by clicking the account icon in the header.'}
                </Typography>
                <Icon name="person" color={'white'} size={theme.size.xl} style={{ marginVertical: theme.spacing.lg }} />
            </Stack>
        </View>,
    ];

    useEffect(() => {
        const checkTutorialAvailability = async () => {
            const isAvailable = await newTutorialAvailable(TUTORIAL_KEYS.HOME);
            setShowTutorial(isAvailable);
        };
        checkTutorialAvailability();
    }, []);

    return (
        <TutorialModal
            visible={showTutorial}
            onClose={(): void => {
                setTutorialWatched(TUTORIAL_KEYS.HOME);
                setShowTutorial(false);
            }}
        >
            <TutorialCarousel
                slides={slides}
                height={carouselHeight || 200} // Fallback to a default height if not calculated yet
                onClose={(): void => {
                    setTutorialWatched(TUTORIAL_KEYS.HOME);
                    setShowTutorial(false);
                }}
            />
        </TutorialModal>
    );
};
