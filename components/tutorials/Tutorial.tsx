import { SEButton } from '@/components/common/SEButton';
import { useAppTheme } from '@/theme';
import { width } from '@/utilities/dimensions';
import React, { JSX, PropsWithChildren, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

export const TutorialCarousel: React.FC<{
    slides: (JSX.Element | null)[];
    height: number;
    onClose: () => void;
    canFinish?: boolean;
}> = ({ slides, height, onClose, canFinish = true }) => {
    const theme = useAppTheme();
    const filteredSlides = slides.filter((slide) => slide !== null);
    const [showButton, setShowButton] = useState(filteredSlides.length < 2);
    const progress = useSharedValue<number>(0);

    return (
        <View>
            <Carousel<JSX.Element>
                data={filteredSlides}
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
                    if (index === filteredSlides.length - 1) {
                        setShowButton(true);
                    }
                }}
            />
            {filteredSlides.length > 1 && (
                <Pagination.Basic
                    progress={progress}
                    data={filteredSlides}
                    dotStyle={{
                        borderRadius: 100,
                        backgroundColor: 'rgba(255,255,255,0.35)',
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
            {canFinish && (
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
            )}
        </View>
    );
};
