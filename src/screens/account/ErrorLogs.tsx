import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { SEButton, CollapsibleHeaderLayout, wrapIcon, HeaderIcon, Stack, Typography } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Utilities
import { Logger } from '../../utilities/logging';

// Types
import { LOAD_LOGS } from '../../redux/actions/types';
import { ApplicationState } from '../../__types__';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';

// Icons
const RefreshIcon = wrapIcon({ IconClass: MatIcon, name: 'refresh' });
const MailIcon = wrapIcon({ IconClass: MatIcon, name: 'mail' });

export const ErrorLogs: React.FC<StackScreenProps<RootStackParamList, 'Logs'>> = (props) => {
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const token = useSelector((state: ApplicationState) => state.login.token);
    const loading = useSelector((state: ApplicationState) => state.logs.loading);
    const username = useSelector((state: ApplicationState) => state.userData.username);
    const theme = useAppTheme();

    const getLogs = useCallback(async (): Promise<void> => {
        dispatch({ type: LOAD_LOGS.REQUEST });
        const storedLogs = await Logger.readMessages('ERROR');
        dispatch({ type: LOAD_LOGS.SUCCESS });
        setLogs(storedLogs);
    }, [dispatch]);

    const sendMail = useCallback(() => {
        void Logger.sendEmail(
            'ERROR',
            (): void => {
                void getLogs();
            },
            username
        );
    }, [getLogs, username]);

    useEffect(() => {
        if (!token) {
            props.navigation.pop();
        }
    }, [props.navigation, token]);

    useEffect(() => {
        void getLogs();
    }, [getLogs]);

    const actionItems: HeaderIcon[] = [
        {
            icon: RefreshIcon,
            onPress: (): void => {
                void getLogs();
            },
        },
    ];
    if (logs.length > 0) {
        actionItems.push({
            icon: MailIcon,
            onPress: () => sendMail(),
        });
    }
    actionItems.reverse();
    return (
        <CollapsibleHeaderLayout
            title={'Error Logs'}
            subtitle={'What went wrong'}
            refreshing={loading}
            showAuth={false}
            actionItems={actionItems}
            onRefresh={(): void => {
                void getLogs();
            }}
            navigation={props.navigation}
        >
            <Stack style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}>
                <SEButton
                    title={'SEND ERROR REPORT'}
                    onPress={(): void => sendMail()}
                    style={{ marginBottom: theme.spacing.md }}
                />
                <Typography variant={'bodySmall'}>{logs}</Typography>
            </Stack>
        </CollapsibleHeaderLayout>
    );
};
