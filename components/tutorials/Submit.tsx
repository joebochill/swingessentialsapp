import { TUTORIAL_KEYS } from '@/_config';
import { Icon } from '@/components/common/Icon';
import { Stack } from '@/components/layout/Stack';
import { TutorialCarousel, TutorialModal } from '@/components/tutorials/Tutorial';
import { newTutorialAvailable, setTutorialWatched } from '@/components/tutorials/tutorialsUtilities';
import { Typography } from '@/components/typography/Typography';
import { RecordButton } from '@/components/videos/RecordButton';
import { SwingVideo } from '@/components/videos/SwingVideo';
import { useAppTheme } from '@/theme';
import { useCameraPermissions } from 'expo-camera';
import { useMediaLibraryPermissions } from 'expo-image-picker';
import { openSettings } from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { SEButton } from '../common/SEButton';

export const SubmitTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = useMediaLibraryPermissions();

    const slides = [
        <Stack
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setCarouselHeight((prev) => (height > prev ? height : prev));
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
                setCarouselHeight((prev) => (height > prev ? height : prev));
            }}
        >
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Permissions'}
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
                {'Swing Essentials needs access to your camera and media library for you to submit videos.'}
            </Typography>
            {(!mediaPermission?.granted || !cameraPermission?.granted) && (
                <View style={{ marginTop: theme.spacing.xxl }}>
                    <SEButton
                        mode={theme.dark ? 'contained' : 'outlined'}
                        buttonColor={theme.dark ? undefined : 'white'}
                        // buttonColor={theme.dark ? undefined : theme.colors.primaryContainer}
                        // labelStyle={{ color: theme.colors.onPrimaryContainer }}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        title={cameraPermission?.granted ? 'Camera Access Granted' : 'Allow Camera Access'}
                        style={{
                            opacity: cameraPermission?.granted ? 0.5 : 1,
                            alignSelf: 'center',
                        }}
                        icon={cameraPermission?.granted ? 'check-circle-outline' : undefined}
                        onPress={
                            cameraPermission?.granted
                                ? undefined
                                : async (): Promise<void> => {
                                      if (cameraPermission?.canAskAgain) {
                                          await requestCameraPermission();
                                      } else {
                                          openSettings();
                                      }
                                  }
                        }
                    />
                    <SEButton
                        mode={theme.dark ? 'contained' : 'outlined'}
                        buttonColor={theme.dark ? undefined : 'white'}
                        // buttonColor={theme.dark ? undefined : theme.colors.primaryContainer}
                        // labelStyle={{ color: theme.colors.onPrimaryContainer }}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        title={mediaPermission?.granted ? 'Library Access Granted' : 'Allow Library Access'}
                        style={{
                            marginTop: theme.spacing.lg,
                            opacity: mediaPermission?.granted ? 0.5 : 1,
                            alignSelf: 'center',
                        }}
                        icon={mediaPermission?.granted ? 'check-circle-outline' : undefined}
                        onPress={
                            mediaPermission?.granted
                                ? undefined
                                : async (): Promise<void> => {
                                      if (mediaPermission?.canAskAgain) {
                                          await requestMediaPermission();
                                      } else {
                                          openSettings();
                                      }
                                  }
                        }
                    />
                </View>
            )}
            {mediaPermission?.granted && cameraPermission?.granted && (
                <View style={{ marginTop: 2 * theme.spacing.xxl }}>
                    <Icon
                        name={'check-circle'}
                        size={theme.size.xxl}
                        color={theme.colors.onPrimary}
                        style={{ alignSelf: 'center' }}
                    />
                    <Typography
                        variant={'bodyLarge'}
                        color={'onPrimary'}
                        align={'center'}
                        style={{ marginTop: theme.spacing.sm }}
                    >
                        {`All necessary permissions have been granted!`}
                    </Typography>
                </View>
            )}
        </Stack>,
        <Stack
            key={3}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setCarouselHeight((prev) => (height > prev ? height : prev));
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
                canFinish={cameraPermission?.granted && mediaPermission?.granted}
            />
        </TutorialModal>
    );
};
