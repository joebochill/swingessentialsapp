import { TUTORIAL_KEYS } from '@/_config';
import { Icon } from '@/components/common/Icon';
import { Stack } from '@/components/layout/Stack';
import { TutorialCarousel, TutorialModal } from '@/components/tutorials/Tutorial';
import { newTutorialAvailable, setTutorialWatched } from '@/components/tutorials/tutorialsUtilities';
import { Typography } from '@/components/typography/Typography';
import { useAppTheme } from '@/theme';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

export const HomeTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const slides = [
        <View
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setCarouselHeight((prev) => (height > prev ? height : prev));
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
                setCarouselHeight((prev) => (height > prev ? height : prev));
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
