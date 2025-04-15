import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Modal, ModalProps, View } from 'react-native';
import { atob } from '../../utilities';

import { useAppTheme } from '../../theme';
import { SectionHeader, Stack } from '../layout';
import { Paragraph, Typography } from '../typography';
import { SEButton } from '../SEButton';
import { RootState } from '../../redux/store';
import { useGetRoleMutation, useLogoutMutation, useRefreshTokenMutation } from '../../redux/apiServices/authService';

const formatTime = (remaining: number): string => {
    if (!remaining || remaining <= 0) {
        return '00:00';
    }

    const min = Math.floor(remaining / 60);
    const sec = Math.floor(remaining - min * 60);

    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
};

export const TokenModal: React.FC<ModalProps> = (props) => {
    const { ...other } = props;
    const theme = useAppTheme();

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const [refreshToken, { isLoading: refreshing }] = useRefreshTokenMutation();
    const [getUserRole, { data: dbRole }] = useGetRoleMutation();
    const [logout] = useLogoutMutation();

    const [timeRemaining, setTimeRemaining] = useState(-1);
    const [engageCountdown, setEngageCountdown] = useState(false);
    const [updateRate, setUpdateRate] = useState(1);

    const updateRefreshRate = useCallback(() => {
        if (timeRemaining <= 3 * 60) {
            setUpdateRate(1);
        } else if (timeRemaining <= 10 * 60) {
            setUpdateRate(1 * 60);
        } else if (timeRemaining <= 20 * 60) {
            setUpdateRate(5 * 60);
        } else {
            setUpdateRate(30 * 60);
        }
    }, [timeRemaining]);

    useEffect(() => {
        // timer to check for pending user registration
        if (role === 'pending') {
            const interval = setInterval(() => {
                getUserRole();
            }, 20 * 1000);
            return (): void => clearInterval(interval);
        }
    }, [token, role]);

    // Get a new token after registration is complete
    useEffect(() => {
        if (token && role && dbRole && role !== dbRole) {
            refreshToken();
        }
    }, [token, role, dbRole, refreshToken]);

    useEffect(() => {
        // set the time remaining on login/logout
        if (token) {
            const exp = JSON.parse(atob(token.split('.')[1])).exp;
            setTimeRemaining(exp - Date.now() / 1000);
            setEngageCountdown(true);
        } else {
            setTimeRemaining(0);
            setEngageCountdown(false);
        }
    }, [token]);

    useEffect(() => {
        // Update the timer
        if (!token || !engageCountdown) {
            return;
        }
        let interval: any = 0;
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                const exp = JSON.parse(atob(token.split('.')[1])).exp;
                setTimeRemaining(exp - Date.now() / 1000);
            }, updateRate * 1000);
            updateRefreshRate();
        } else {
            logout();
        }

        return (): void => clearInterval(interval);
    }, [timeRemaining, engageCountdown, token, updateRate, updateRefreshRate]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={(): void => {}}
            onDismiss={(): void => {}}
            visible={token !== null && timeRemaining <= 3 * 60 && timeRemaining > 0}
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
                        title={'Automatic Logout'}
                        action={<Typography>{formatTime(timeRemaining)}</Typography>}
                    />
                    <Paragraph>{'Your current session is about to expire. Click below to stay signed in.'}</Paragraph>

                    {!refreshing && (
                        <SEButton
                            title="KEEP ME SIGNED IN"
                            style={{ marginTop: theme.spacing.md }}
                            onPress={(): void => {
                                refreshToken();
                            }}
                        />
                    )}
                    {refreshing && (
                        <ActivityIndicator
                            style={{ marginTop: theme.spacing.lg }}
                            size={'large'}
                            color={theme.colors.onPrimaryContainer}
                        />
                    )}
                </View>
            </Stack>
        </Modal>
    );
};
