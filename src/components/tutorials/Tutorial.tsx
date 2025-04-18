import React, { JSX, PropsWithChildren, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { SEButton } from '../SEButton';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { width } from '../../utilities/dimensions';
import { useSharedValue } from 'react-native-reanimated';
import { setTutorialWatched } from '../../utilities/tutorials';

type TutorialProps = {
    visible: boolean;
    onClose: () => void;
};

export const TutorialModal: React.FC<PropsWithChildren<TutorialProps>> = (props) => {
    const { visible = true, onClose } = props;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    return (
        <Modal
            isVisible={visible}
            backdropColor={theme.dark ? theme.colors.background : theme.colors.primary}
            style={{ flex: 1, margin: 0, padding: 0 }}
            backdropOpacity={1}
            animationInTiming={750}
            animationOutTiming={750}
            statusBarTranslucent
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    position: 'relative',
                    justifyContent: 'center',
                    backgroundColor: theme.dark ? theme.colors.background : theme.colors.primary,
                }}
            >
                <SEButton
                    uppercase
                    compact
                    dark
                    style={{
                        position: 'absolute',
                        top: insets.top,
                        right: 0,
                        marginRight: theme.spacing.md,
                        zIndex: 100,
                    }}
                    labelStyle={{ color: theme.colors.onPrimary, marginHorizontal: 0 }}
                    mode={'text'}
                    title="Skip"
                    onPress={onClose}
                />
                <View style={{ marginVertical: insets.top }}>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}>
                        {props.children}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export const TutorialCarousel: React.FC<{ slides: JSX.Element[]; height: number; onClose: () => void }> = ({
    slides,
    height,
    onClose,
}) => {
    const theme = useAppTheme();
    const [showButton, setShowButton] = useState(slides.length < 2);
    const progress = useSharedValue<number>(0);

    return (
        <View>
            <Carousel<JSX.Element>
                data={slides}
                loop={false}
                height={height || 200} // Fallback to a default height if not calculated yet
                width={width - 2 * theme.spacing.md}
                style={{
                    width: width - 2 * theme.spacing.md,
                }}
                onConfigurePanGesture={(gestureChain) => {
                    gestureChain.activeOffsetX([-10, 10]);
                }}
                onProgressChange={progress}
                renderItem={({ item }) => item}
                onSnapToItem={(index: number): void => {
                    if (index === slides.length - 1) {
                        setShowButton(true);
                    }
                }}
            />
            {slides.length > 1 && (
                <Pagination.Basic
                    progress={progress}
                    data={slides}
                    dotStyle={{
                        borderRadius: 100,
                        backgroundColor: `rgba(255,255,255,0.35)`,
                    }}
                    activeDotStyle={{
                        borderRadius: 100,
                        overflow: 'hidden',
                        backgroundColor: theme.colors.onPrimary,
                    }}
                    containerStyle={[
                        {
                            gap: 5,
                            marginTop: theme.spacing.md,
                        },
                    ]}
                />
            )}
            <SEButton
                mode={'contained'}
                uppercase
                title={'Got It'}
                disabled={!showButton}
                buttonColor={theme.dark ? undefined : theme.colors.secondary}
                style={{
                    opacity: showButton ? 1 : 0,
                    marginTop: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                }}
                onPress={(): void => {
                    onClose();
                }}
            />
        </View>
    );
};
