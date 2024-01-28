import React from 'react';
// Components
import { ActivityIndicator, Modal, ModalProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Typography } from '../../components';

// Styles
import { useSharedStyles, useListStyles } from '../../styles';
import { whiteOpacity } from '../../styles/colors';
import { useTheme, Subheading, MD3Theme } from 'react-native-paper';

const useStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    modalBackground: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            // padding: theme.spaces.xLarge,
            alignItems: 'stretch',
            justifyContent: 'center',
            backgroundColor: whiteOpacity(0.75),
        },
    });
type ProgressModalProps = ModalProps & {
    visible?: boolean;
    progress: number;
};
export const UploadProgressModal: React.FC<ProgressModalProps> = (props) => {
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
                            // padding: theme.spaces.medium,
                        },
                    ]}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                                <Subheading style={listStyles.heading}>{'Submitting Lesson'}</Subheading>
                                <ActivityIndicator /*color={theme.colors.accent}*/ />
                            </View>
                            <Typography style={{ textAlign: 'left' }}>{`Uploading Videos... ${progress.toFixed(
                                0
                            )}%`}</Typography>
                            {progress >= 100 && <Typography>{'Creating Lesson...'}</Typography>}
                        </View>
                        <View style={{ flex: 0, justifyContent: 'center' }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
