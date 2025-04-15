import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
// import { SEButton, Stack, Typography, IconProps } from '../../components';

// Utilities
import { Logger } from '../../utilities/logging';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { RefreshControl, ScrollView } from 'react-native';
import { IconProps } from '../../components/Icon';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { Stack } from '../../components/layout';
import { SEButton } from '../../components/SEButton';
import { Typography } from '../../components/typography';

export const ErrorLogs: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const token = ''; //useSelector((state: ApplicationState) => state.login.token);
    const loading = false; //useSelector((state: ApplicationState) => state.logs.loading);
    const username = 'xxx'; //useSelector((state: ApplicationState) => state.userData.username);
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const getLogs = useCallback(async (): Promise<void> => {
        // dispatch({ type: LOAD_LOGS.REQUEST });
        // const storedLogs = await Logger.readMessages('ERROR');
        // dispatch({ type: LOAD_LOGS.SUCCESS });
        // setLogs(storedLogs);
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

    // useEffect(() => {
    //     if (!token) {
    //         props.navigation.pop();
    //     }
    // }, [props.navigation, token]);

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
                navigation={navigation}
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
