import React from 'react';
// Components
import { ActivityIndicator, Modal, ModalProps, StyleSheet, View } from 'react-native';
import { Body } from '../../components';

// Styles
import { useSharedStyles, useListStyles } from '../../styles';
import { whiteOpacity } from '../../styles/colors';
import { useTheme, Theme, Subheading } from 'react-native-paper';

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            padding: theme.spaces.xLarge,
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
    const styles = useStyles(theme);
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);

    return (
        <Modal animationType="slide" transparent={true} visible={visible} {...other}>
            <View style={styles.modalBackground}>
                <View
                    style={[
                        sharedStyles.border,
                        {
                            backgroundColor: theme.colors.surface,
                            padding: theme.spaces.medium,
                        },
                    ]}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                                <Subheading style={listStyles.heading}>{'Submitting Lesson'}</Subheading>
                                <ActivityIndicator color={theme.colors.accent} />
                            </View>
                            <Body style={{ textAlign: 'left' }}>{`Uploading Videos... ${progress.toFixed(0)}%`}</Body>
                            {progress >= 100 && <Body>{'Creating Lesson...'}</Body>}
                        </View>
                        <View style={{ flex: 0, justifyContent: 'center' }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
