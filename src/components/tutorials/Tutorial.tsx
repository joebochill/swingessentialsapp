import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { SEButton } from '../';
import Modal from 'react-native-modal';
import { useTheme } from '../../styles/theme';
import { spaces } from '../../styles/sizes';
import { useSafeArea } from 'react-native-safe-area-context';

type TutorialProps = {
    visible: boolean;
    onClose: Function;
}
export const TutorialModal: React.FC<TutorialProps> = props => {
    const { visible = true, onClose } = props;
    const theme = useTheme();
    const insets = useSafeArea();
    return (
        <Modal
            isVisible={visible}
            backdropColor={theme.colors.primary[400]}
            style={{ margin: 0, padding: 0}}
            backdropOpacity={1}
            animationInTiming={500}
            animationOutTiming={500}
        >
            <SafeAreaView style={{ flex: 1, position: 'relative', justifyContent: 'center' }}>
                <SEButton
                    containerStyle={{ position: 'absolute', top: insets.top, right: 0, marginRight: spaces.medium }}
                    link
                    title="Skip"
                    onPress={() => onClose()}
                />
                <View>
                    <ScrollView>{props.children}</ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    )
};