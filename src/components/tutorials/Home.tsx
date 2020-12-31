import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
// Components
import { View } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { H7, H4 } from '../index';
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

export const HomeTutorial = () => {
    const [activePanel, setActivePanel] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const dispatch = useDispatch();

    const slides = [
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Welcome to Swing Essentials®!'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: theme.spaces.small,
                    marginBottom: theme.spaces.medium,
                    color: theme.colors.onPrimary,
                }}
            >
                {'The Swing Essentials app gives you quick access to everything you need to keep improving your swing.'}
            </H7>
        </>,
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Sign Up Today'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: theme.spaces.small,
                    marginBottom: theme.spaces.medium,
                    color: theme.colors.onPrimary,
                }}
            >
                {'You can sign in or register for an account by clicking the account icon in the header.'}
            </H7>
            <MatIcon
                name="person"
                color={'white'}
                size={theme.sizes.xLarge}
                style={{ marginVertical: theme.spaces.large, alignSelf: 'center' }}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_home}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]))}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }) => slides[index]}
                    sliderWidth={width - 2 * theme.spaces.medium}
                    itemWidth={width - 2 * theme.spaces.medium}
                    onSnapToItem={(index) => {
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
                    title="GOT IT"
                    disabled={!showButton}
                    style={{ flex: 1, marginTop: 0, opacity: showButton ? 1 : 0 }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.HOME]))}
                />
            </View>
        </TutorialModal>
    );
};
