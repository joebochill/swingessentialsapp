import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { Typography } from '../';
import { SEButton, Stack } from '..';
import { TutorialModal } from '.';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { width } from '../../utilities/dimensions';

// Redux
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
// Constants
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { RecordButton } from '../videos';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../videos/SwingVideo';

export const SubmitTutorial: React.FC = () => {
    const [activePanel, setActivePanel] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useAppTheme();
    const dispatch = useDispatch();

    const slides = [
        <Stack key={1}>
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
        <Stack key={2}>
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
            <MatIcon
                name="settings"
                color={theme.colors.onPrimary}
                size={theme.size.xl}
                style={{ alignSelf: 'center', marginTop: theme.spacing.lg }}
            />
        </Stack>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_submit_swing}
            onClose={(): void => {
                // @ts-ignore
                dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.SUBMIT_SWING]));
            }}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }: { index: number }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * theme.spacing.md}
                    itemWidth={width - 2 * theme.spacing.md}
                    onSnapToItem={(index): void => {
                        setActivePanel(index);
                        if (index === slides.length - 1) {
                            setShowButton(true);
                        }
                    }}
                />
                <Pagination
                    dotsLength={slides.length}
                    activeDotIndex={activePanel}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginHorizontal: 0,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                    }}
                    inactiveDotOpacity={0.5}
                    inactiveDotScale={0.8}
                />
                <SEButton
                    dark
                    mode={'contained'}
                    uppercase
                    title={'Got It'}
                    disabled={!showButton}
                    buttonColor={theme.colors.secondary}
                    style={{ opacity: showButton ? 1 : 0 }}
                    onPress={(): void => {
                        // @ts-ignore
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.SUBMIT_SWING]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
