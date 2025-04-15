import React, { PropsWithChildren } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { SEButton } from '../SEButton';

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
            backdropColor={theme.colors.primary}
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
                    backgroundColor: theme.colors.primary,
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
