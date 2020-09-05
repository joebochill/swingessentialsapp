import React from 'react';
// Components
import { ActivityIndicator, Modal, ModalProps, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { H7, Body } from '../../components';

// Styles
import { useSharedStyles } from '../../styles';
import { whiteOpacity } from '../../styles/colors';
import { spaces } from '../../styles/sizes';
import { useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        padding: spaces.xLarge,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: whiteOpacity(0.75),
    },
});
type ProgressModalProps = ModalProps & {
    visible?: boolean;
    progress: number;
};
export const UploadProgressModal = (props: ProgressModalProps) => {
    const { visible, progress, ...other } = props;
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    return (
        <Modal animationType="slide" transparent={true} visible={visible} {...other}>
            <View style={styles.modalBackground}>
                <View
                    style={[
                        sharedStyles.border,
                        {
                            backgroundColor: theme.colors.surface,
                            padding: spaces.medium,
                        },
                    ]}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginRight: spaces.medium }}>
                            <View style={{ flexDirection: 'row', marginBottom: spaces.medium }}>
                                <Icon
                                    name={'file-upload'}
                                    color={theme.colors.text}
                                    containerStyle={{ marginRight: spaces.small }}
                                />
                                <H7>Submitting Your Lesson</H7>
                            </View>
                            <Body>{`Uploading Videos... ${progress.toFixed(0)}%`}</Body>
                            {progress >= 100 && <Body>{'Creating Lesson...'}</Body>}
                        </View>
                        <View style={{ flex: 0, justifyContent: 'center' }}>
                            <ActivityIndicator color={theme.colors.accent} size={'large'} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
