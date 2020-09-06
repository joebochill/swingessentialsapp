import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { H7, H4 } from '../index';
import { SEButton, SEVideoPlaceholder } from '..';
import { TutorialModal } from '.';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// Styles
import { useSharedStyles } from '../../styles';
import { sizes, spaces, unit } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';
import { whiteOpacity } from '../../styles/colors';
// Images
import dtl from '../../images/down-the-line.png';
import fo from '../../images/face-on.png';
// Redux
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
// Constants
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { RecordButton } from '../videos';

export const SubmitTutorial = () => {
    const [activePanel, setActivePanel] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const dispatch = useDispatch();

    const slides = [
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Submitting Your Swing'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {
                    'When you are ready to submit your swing, click on the golfer images to upload Face-On and Down-the-Line videos.'
                }
            </H7>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SEVideoPlaceholder
                    inverse
                    disabled
                    title={'Face-On'}
                    icon={<Image source={fo} resizeMethod={'resize'} style={[sharedStyles.image]} />}
                    editIcon={<Icon name={'add-a-photo'} color={theme.colors.accent} />}
                />
                <SEVideoPlaceholder
                    inverse
                    disabled
                    title={'Down-the-Line'}
                    icon={<Image source={dtl} resizeMethod={'resize'} style={sharedStyles.image} />}
                    editIcon={<Icon name={'add-a-photo'} color={theme.colors.accent} />}
                />
            </View>
        </>,
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Using the Camera'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {'Press the Record button to start recording your swing.'}
            </H7>
            <RecordButton
                recording={false}
                onPress={() => {}}
                style={{ alignSelf: 'center', marginTop: spaces.large }}
            />
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.xLarge,
                    marginBottom: spaces.xLarge,
                    color: theme.colors.onPrimary,
                }}>
                {'You can adjust your settings for recording length and delay by clicking the settings icon.'}
            </H7>
            <Icon name="settings" color={'white'} size={sizes.xLarge} />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_submit_swing}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.SUBMIT_SWING]))}>
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
                    dark
                    title="GOT IT"
                    disabled={!showButton}
                    style={{ flex: 1, marginTop: 0, opacity: showButton ? 1 : 0 }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.SUBMIT_SWING]))}
                />
            </View>
        </TutorialModal>
    );
};
