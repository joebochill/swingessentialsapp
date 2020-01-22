import React, { useState } from 'react';
import { useTheme } from '../../styles/theme';
// Components
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { H7, H4 } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './Tutorial';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// Styles
import { sizes, spaces, unit } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';
import { whiteOpacity } from '../../styles/colors';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';

export const HomeTutorial = () => {
    const [activePanel, setActivePanel] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const dispatch = useDispatch();

    const slides = [
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary[50] }}>
                {'Welcome to Swing Essentials™!'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary[50],
                }}>
                {'The Swing Essentials app gives you quick access to everything you need to keep improving your swing.'}
            </H7>
        </>,
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary[50] }}>
                {'Sign Up Today'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary[50],
                }}>
                {'You can sign in or register for an account by clicking the account icon in the header.'}
            </H7>
            <Icon name="person" color={'white'} size={sizes.xLarge} containerStyle={{ marginVertical: spaces.large }} />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_home}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]))}>
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }) => slides[index]}
                    sliderWidth={width - 2 * spaces.medium}
                    itemWidth={width - 2 * spaces.medium}
                    onSnapToItem={index => {
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
                    title="GOT IT"
                    disabled={!showButton}
                    containerStyle={{ flex: 1, marginTop: 0, opacity: showButton ? 1 : 0 }}
                    buttonStyle={{ backgroundColor: theme.colors.primary[500] }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]))}
                />
            </View>
        </TutorialModal>
    );
};
