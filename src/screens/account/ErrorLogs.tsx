import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { View } from 'react-native';
import { Body, SEButton, CollapsibleHeaderLayout, wrapIcon, HeaderIcon } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import { useSharedStyles } from '../../styles';

// Utilities
import { Logger } from '../../utilities/logging';

// Types
import { LOAD_LOGS } from '../../redux/actions/types';
import { ApplicationState } from 'src/__types__';
import { useTheme } from 'react-native-paper';

// Icons
const RefreshIcon = wrapIcon({ IconClass: MatIcon, name: 'refresh' });
const MailIcon = wrapIcon({ IconClass: MatIcon, name: 'mail' });

export const ErrorLogs = props => {
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const token = useSelector((state: ApplicationState) => state.login.token);
    const loading = useSelector((state: ApplicationState) => state.logs.loading);
    const username = useSelector((state: ApplicationState) => state.userData.username);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);

    const getLogs = useCallback(async () => {
        dispatch({ type: LOAD_LOGS.REQUEST });
        const _logs = await Logger.readMessages('ERROR');
        dispatch({ type: LOAD_LOGS.SUCCESS });
        setLogs(_logs);
    }, [dispatch]);

    const sendMail = useCallback(() => {
        Logger.sendEmail('ERROR', () => getLogs(), username);
    }, [getLogs, username]);

    useEffect(() => {
        if (!token) {
            props.navigation.pop();
        }
    }, [props.navigation, token]);

    useEffect(() => {
        getLogs();
    }, [getLogs]);

    const actionItems: HeaderIcon[] = [
        {
            icon: RefreshIcon,
            onPress: () => getLogs(),
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
            onRefresh={() => {
                getLogs();
            }}>
            <View style={[sharedStyles.paddingHorizontalMedium]}>
                <Body>{logs}</Body>
                <SEButton title={'SEND ERROR REPORT'} onPress={() => sendMail()} />
            </View>
        </CollapsibleHeaderLayout>
    );
};
