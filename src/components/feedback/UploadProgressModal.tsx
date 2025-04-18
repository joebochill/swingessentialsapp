import React from 'react';
// Components
import { ActivityIndicator, Modal, ModalProps, View } from 'react-native';

// Styles
import { useAppTheme } from '../../theme';
import { SectionHeader } from '../typography/SectionHeader';
import { Stack } from '../layout/Stack';
import { Paragraph } from '../typography';

type ProgressModalProps = ModalProps & {
    visible?: boolean;
    progress: number;
};
export const UploadProgressModal: React.FC<ProgressModalProps> = (props) => {
    const { visible, progress, ...other } = props;
    const theme = useAppTheme();

    return (
        <Modal animationType="slide" transparent={true} visible={visible} {...other}>
            <Stack
                justify={'center'}
                style={{
                    flex: 1,
                    padding: theme.spacing.md,
                    backgroundColor: 'rgba(255,255,255,0.75)',
                }}
            >
                <View
                    style={[
                        {
                            borderWidth: 1,
                            borderRadius: theme.roundness,
                            borderColor: theme.colors.primary,
                            backgroundColor: theme.colors.primaryContainer,
                            padding: theme.spacing.md,
                        },
                    ]}
                >
                    <Stack direction={'row'}>
                        <Stack style={{ flex: 1 }}>
                            <SectionHeader
                                title={'Submitting Lesson'}
                                action={<ActivityIndicator color={theme.colors.onPrimaryContainer} />}
                            />
                            <Paragraph>{`Uploading Videos... ${progress.toFixed(0)}%`}</Paragraph>
                            {progress >= 100 && <Paragraph>{'Creating Lesson...'}</Paragraph>}
                        </Stack>
                    </Stack>
                </View>
            </Stack>
        </Modal>
    );
};
