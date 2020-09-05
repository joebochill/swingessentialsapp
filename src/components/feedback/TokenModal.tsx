import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { ActivityIndicator, Modal, ModalProps, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { H7, Body, SEButton } from '../';

// Styles
import { whiteOpacity } from '../../styles/colors';
import { spaces } from '../../styles/sizes';
import { useSharedStyles } from '../../styles';
import { useTheme } from 'react-native-paper';

// Types
import { ApplicationState } from '../../__types__';

// Utilities
import { atob } from '../../utilities';

// Redux
import { requestLogout, refreshToken, checkToken } from '../../redux/actions';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        padding: spaces.xLarge,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: whiteOpacity(0.75),
    },
});

export const TokenModal = (props: ModalProps) => {
    const { ...other } = props;
    const token = useSelector((state: ApplicationState) => state.login.token);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const refreshing = useSelector((state: ApplicationState) => state.login.pending);

    const [timeRemaining, setTimeRemaining] = useState(-1);
    const [engageCountdown, setEngageCountdown] = useState(false);
    const [updateRate, setUpdateRate] = useState(1);

    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);

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
                dispatch(checkToken());
            }, 20 * 1000);
            return () => clearInterval(interval);
        }
    }, [token, dispatch, role]);

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
        let interval: number = 0;
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                // setTimeRemaining(timeRemaining => timeRemaining - updateRate);
                const exp = JSON.parse(atob(token.split('.')[1])).exp;
                setTimeRemaining(exp - Date.now() / 1000);
            }, updateRate * 1000);
            updateRefreshRate();
        } else {
            dispatch(requestLogout());
        }

        return () => clearInterval(interval);
    }, [timeRemaining, engageCountdown, token, updateRate, updateRefreshRate, dispatch]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => {}}
            onDismiss={() => {}}
            visible={token !== null && timeRemaining <= 3 * 60 && timeRemaining > 0}
            {...other}>
            <View style={styles.modalBackground}>
                <View
                    style={[
                        sharedStyles.border,
                        {
                            backgroundColor: theme.colors.surface,
                            padding: spaces.medium,
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', marginBottom: spaces.medium }}>
                        <Icon
                            name={'clock-alert-outline'}
                            type={'material-community'}
                            color={theme.colors.text}
                            containerStyle={{ marginRight: spaces.small }}
                        />
                        <H7 style={{ flex: 1 }}>{'Session Expiring'}</H7>
                        <Body>{_formatTime(timeRemaining)}</Body>
                    </View>
                    <Body>{'Your current session is about to expire. Click below to stay signed in.'}</Body>

                    {!refreshing && (
                        <SEButton dark
                            title="KEEP ME SIGNED IN"
                            style={{ marginTop: spaces.medium }}
                            onPress={() => dispatch(refreshToken())}
                        />
                    )}
                    {refreshing && (
                        <ActivityIndicator
                            style={{ marginTop: spaces.xLarge }}
                            size={'large'}
                            color={theme.colors.accent}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const _formatTime = (remaining: number): string => {
    if (!remaining || remaining <= 0) {
        return '00:00';
    }

    const min = Math.floor(remaining / 60);
    const sec = Math.floor(remaining - min * 60);

    return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
};
