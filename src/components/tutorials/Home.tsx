import React, { useState } from 'react';

// Components
import { View } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { Stack, Typography } from '../';
import { SEButton } from '../SEButton';
import { TutorialModal } from './Tutorial';
import Carousel, { Pagination } from 'react-native-snap-carousel';

// Styles
import { unit } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';
import { whiteOpacity } from '../../styles/colors';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { useAppTheme } from '../../styles/theme';

export const HomeTutorial: React.FC = () => {
    const [activePanel, setActivePanel] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useAppTheme();
    const dispatch = useDispatch();

    const slides = [
        <Stack key={1} align={'center'}>
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
                {'The Swing Essentials app gives you quick access to everything you need to keep improving your swing.'}
            </Typography>
        </Stack>,
        <Stack key={2} align={'center'}>
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
            <MatIcon name="person" color={'white'} size={theme.size.xl} style={{ marginVertical: theme.spacing.lg }} />
        </Stack>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_home}
            onClose={(): void => {
                // @ts-ignore
                dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]));
            }}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }: { index: number }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * theme.spacing.md}
                    itemWidth={width - 2 * theme.spacing.md}
                    onSnapToItem={(index: number): void => {
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
                        width: unit(10),
                        height: unit(10),
                        borderRadius: unit(10),
                        marginHorizontal: 0,
                        backgroundColor: whiteOpacity(0.9),
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
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
