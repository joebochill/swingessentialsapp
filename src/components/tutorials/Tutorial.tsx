import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { SEButton } from '../';
import Modal from 'react-native-modal';
import { useTheme } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFlexStyles } from '../../styles';

type TutorialProps = {
    visible: boolean;
    onClose: Function;
};

export const TutorialModal: React.FC<TutorialProps> = props => {
    const { visible = true, onClose } = props;
    const theme = useTheme();
    const flexStyles = useFlexStyles(theme);
    const insets = useSafeArea();

    return (
        <Modal
            isVisible={visible}
            backdropColor={theme.colors.primary}
            style={{ margin: 0, padding: 0 }}
            backdropOpacity={1}
            animationInTiming={750}
            animationOutTiming={750}>
            <SafeAreaView
                style={{
                    flex: 1,
                    position: 'relative',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.primary,
                }}>
                <SEButton
                    uppercase
                    style={{
                        position: 'absolute',
                        top: insets.top,
                        right: 0,
                        marginRight: theme.spaces.medium,
                        zIndex: 100,
                    }}
                    labelStyle={{ color: theme.colors.onPrimary }}
                    mode={'text'}
                    title="Skip"
                    onPress={() => onClose()}
                />
                <View style={{ marginVertical: insets.top }}>
                    <ScrollView contentContainerStyle={flexStyles.paddingHorizontal}>{props.children}</ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};
