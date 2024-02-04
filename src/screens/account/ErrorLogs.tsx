import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { SEButton, Stack, Typography, IconProps } from '../../components';

// Utilities
import { Logger } from '../../utilities/logging';

// Types
import { LOAD_LOGS } from '../../redux/actions/types';
import { ApplicationState } from '../../__types__';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { RefreshControl, ScrollView } from 'react-native';

export const ErrorLogs: React.FC<StackScreenProps<RootStackParamList, 'Logs'>> = (props) => {
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const token = useSelector((state: ApplicationState) => state.login.token);
    const loading = useSelector((state: ApplicationState) => state.logs.loading);
    const username = useSelector((state: ApplicationState) => state.userData.username);
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

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

    const actionItems: IconProps[] = [
        {
            name: 'refresh',
            onPress: (): void => {
                void getLogs();
            },
        },
    ];
    if (logs.length > 0) {
        actionItems.push({
            name: 'mail',
            onPress: () => sendMail(),
        });
    }
    actionItems.reverse();
    return (
        <>
            <Header
                title={'Error Logs'}
                subtitle={'What went wrong'}
                showAuth={false}
                actionItems={actionItems}
                navigation={props.navigation}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={(): void => {
                            void getLogs();
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                <Stack style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}>
                    <SEButton
                        title={'SEND ERROR REPORT'}
                        onPress={(): void => sendMail()}
                        style={{ marginBottom: theme.spacing.md }}
                    />
                    <Typography variant={'bodySmall'}>{logs}</Typography>
                </Stack>
            </ScrollView>
        </>
    );
};
