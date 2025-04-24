import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, ModalProps, View } from 'react-native';

import { useAppTheme } from '../../theme';
import { SectionHeader } from '../typography/SectionHeader';
import { Stack } from '../layout/Stack';
import { Paragraph } from '../typography';
import { SEButton } from '../common/SEButton';
import { usePingQuery } from '../../redux/apiServices/connectivityService';
import { Icon } from '../common/Icon';
import { usePrevious } from '../../hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { initializeData } from '../../redux/thunks';

const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;
const MAX_INTERVAL = ONE_MINUTE;
const INITIAL_INTERVAL = MAX_INTERVAL + 1;
const DELAY_BEFORE_SHOWING_MODAL = 10 * ONE_SECOND;

export const ConnectivityModal: React.FC<ModalProps> = (props) => {
    const { ...other } = props;
    const theme = useAppTheme();
    const { isSuccess, refetch } = usePingQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [intervalTime, setIntervalTime] = useState(INITIAL_INTERVAL);
    const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wasSuccess = usePrevious(isSuccess);

    const dispatch = useDispatch<AppDispatch>();

    const checkConnection = useCallback(async () => {
        try {
            await refetch().unwrap();
            setIsModalVisible(false);
            setIntervalTime(INITIAL_INTERVAL);
            if (modalTimeoutRef.current) {
                clearTimeout(modalTimeoutRef.current);
                modalTimeoutRef.current = null;
            }
        } catch (error) {
            if (!modalTimeoutRef.current) {
                modalTimeoutRef.current = setTimeout(() => {
                    setIsModalVisible(true);
                }, DELAY_BEFORE_SHOWING_MODAL);
            }
            setIntervalTime((prev) => Math.min(prev === INITIAL_INTERVAL ? ONE_SECOND : prev * 2, MAX_INTERVAL));
        }
    }, [refetch]);

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(checkConnection, intervalTime);
        return () => clearInterval(intervalId);
    }, [checkConnection, intervalTime]);

    useEffect(() => {
        if (!wasSuccess && isSuccess) {
            dispatch(initializeData());
        }
    }, [isSuccess, wasSuccess]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
            visible={isModalVisible}
            {...other}
        >
            <Stack
                justify={'center'}
                style={{
                    flex: 1,
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.75)',
                    padding: theme.spacing.md,
                }}
            >
                <View
                    style={[
                        {
                            borderWidth: 1,
                            borderRadius: theme.roundness,
                            borderColor: theme.colors.primary,
                            backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                            padding: theme.spacing.md,
                        },
                    ]}
                >
                    <SectionHeader
                        title={'Connection Lost'}
                        action={<Icon name={'wifi-off'} color={theme.colors.onSurface} />}
                    />
                    <Paragraph>
                        {
                            'We have lost connection to the Swing Essentials service. Check your network connection. If the problem persists, please contact us.'
                        }
                    </Paragraph>
                    <SEButton
                        title="Dismiss"
                        onPress={() => {
                            setIsModalVisible(false);
                            setIntervalTime(INITIAL_INTERVAL);
                        }}
                        style={{ marginTop: theme.spacing.md }}
                    />
                </View>
            </Stack>
        </Modal>
    );
};
