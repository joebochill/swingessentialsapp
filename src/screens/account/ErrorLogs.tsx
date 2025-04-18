import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { IconProps } from '../../components/Icon';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { Stack } from '../../components/layout';
import { SEButton } from '../../components/SEButton';
import { Typography } from '../../components/typography';
import { RootState } from '../../redux/store';
import { clearErrorLog, LOG, readErrorLog } from '../../utilities/logs';
import { useSendMobileLogsMutation } from '../../redux/apiServices/logsService';

export const ErrorLogs: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [sendLogs, { isLoading }] = useSendMobileLogsMutation();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const getLogs = useCallback(async (): Promise<void> => {
        setLoading(true);
        const storedLogs = await readErrorLog();
        setLogs(storedLogs);
        setLoading(false);
    }, []);

    const sendMail = useCallback(async () => {
        try {
            const logsData = await readErrorLog();
            await sendLogs({ data: logsData }).unwrap(); // Unwrap the mutation
            clearErrorLog();
            Alert.alert(
                'Error Report Sent',
                'Your error report has been submitted successfully. Thank you for helping us improve the app!',
                [{ text: 'DONE', onPress: () => getLogs() }]
            );
        } catch (error) {
            Alert.alert(
                'Failed to send error report',
                'Try again later or contact support directly if the problem persists.',
                [{ text: 'DONE' }]
            );
            LOG.error(`Failed to send logs: ${error}`, { zone: 'LOGS' });
        }
    }, [getLogs, sendLogs]);

    useEffect(() => {
        if (!token) {
            navigation.pop();
        }
    }, [navigation, token]);

    useEffect(() => {
        getLogs();
    }, [getLogs]);

    const actionItems: IconProps[] = [
        {
            name: 'refresh',
            onPress: (): void => {
                getLogs();
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
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                navigation={navigation}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={loading || isLoading}
                        onRefresh={(): void => {
                            getLogs();
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                {logs.length > 0 && (
                    <Stack style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}>
                        <SEButton
                            title={'SEND ERROR REPORT'}
                            onPress={async (): Promise<void> => await sendMail()}
                            style={{ marginBottom: theme.spacing.md }}
                        />
                        <Typography variant={'bodySmall'}>{logs}</Typography>
                    </Stack>
                )}
                {logs.length === 0 && (
                    <Stack
                        style={{
                            padding: theme.spacing.md,
                            margin: theme.spacing.md,
                            borderWidth: 1,
                            borderRadius: theme.roundness,
                            borderColor: theme.colors.outline,
                            backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                        }}
                    >
                        <Typography
                            variant={'bodyLarge'}
                            style={{ textAlign: 'center' }}
                            color={theme.dark ? 'onPrimary' : 'primary'}
                        >
                            No error logs found
                        </Typography>
                    </Stack>
                )}
            </ScrollView>
        </>
    );
};
