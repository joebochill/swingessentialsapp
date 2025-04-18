import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { TutorialCarousel, TutorialModal } from '.';
import { TUTORIAL_KEYS } from '../../constants';
import { RecordButton } from '../videos';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../videos/SwingVideo';
import { Stack } from '../layout';
import { Typography } from '../typography';
import { Icon } from '../Icon';
import { newTutorialAvailable, setTutorialWatched } from '../../utilities/tutorials';

export const SubmitTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const slides = [
        <Stack
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Submitting Your Swing'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {
                    'When you are ready to submit your swing, click on the golfer images to upload Face-On and Down-the-Line videos.'
                }
            </Typography>
            <Stack direction={'row'} justify={'space-between'} style={{ marginTop: theme.spacing.md }}>
                <SwingVideo type={'fo'} disabled />
                <SwingVideo type={'dtl'} disabled />
            </Stack>
        </Stack>,
        <Stack
            key={2}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Using the Camera'}
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
                {'Press the Record button to start recording your swing.'}
            </Typography>
            <RecordButton
                recording={false}
                onPress={(): void => {}}
                style={{ alignSelf: 'center', marginTop: theme.spacing.lg }}
            />
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{
                    marginTop: theme.spacing.xl,
                }}
            >
                {'You can adjust your settings for recording length and delay by clicking the settings icon.'}
            </Typography>
            <Icon
                name="settings"
                color={theme.colors.onPrimary}
                size={theme.size.xl}
                style={{ alignSelf: 'center', marginTop: theme.spacing.lg }}
            />
        </Stack>,
    ];

    useEffect(() => {
        const checkTutorialAvailability = async () => {
            const isAvailable = await newTutorialAvailable(TUTORIAL_KEYS.SUBMIT_SWING);
            setShowTutorial(isAvailable);
        };
        checkTutorialAvailability();
    }, []);

    return (
        <TutorialModal
            visible={showTutorial}
            onClose={(): void => {
                setTutorialWatched(TUTORIAL_KEYS.SUBMIT_SWING);
                setShowTutorial(false);
            }}
        >
            <TutorialCarousel
                slides={slides}
                height={carouselHeight || 200} // Fallback to a default height if not calculated yet
                onClose={(): void => {
                    setTutorialWatched(TUTORIAL_KEYS.SUBMIT_SWING);
                    setShowTutorial(false);
                }}
            />
        </TutorialModal>
    );
};
