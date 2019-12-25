import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { View } from 'react-native';
import { wrapIcon } from '@pxblue/react-native-components';
import { Body, SEButton, CollapsibleHeaderLayout } from '../../components';
import { Icon } from 'react-native-elements';

// Styles
import { sharedStyles } from '../../styles';
import { useTheme } from '../../styles/theme';


// Utilities
import { Logger } from '../../utilities/logging';

// Types
import { LOAD_LOGS } from '../../redux/actions/types';
import { ApplicationState } from 'src/__types__';
import { HeaderIcon } from '@pxblue/react-native-components/core/header/header';

// Icons
const RefreshIcon = wrapIcon({ IconClass: Icon, name: 'refresh' });
const MailIcon = wrapIcon({ IconClass: Icon, name: 'mail' });

export const ErrorLogs = () => {
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector((state: ApplicationState) => state.logs.loading);
    const username = useSelector((state: ApplicationState) => state.userData.username);

    const getLogs = useCallback(async () => {
        dispatch({ type: LOAD_LOGS.REQUEST });
        const logs = await Logger.readMessages('ERROR');
        dispatch({ type: LOAD_LOGS.SUCCESS });
        setLogs(logs);
    }, []);

    const sendMail = useCallback(() => {
        Logger.sendEmail('ERROR', () => getLogs(), username);
    }, [getLogs, username]);

    useEffect(() => {
        getLogs();
    }, []);
    const actionItems:HeaderIcon[] = [
        {
            icon: RefreshIcon,
            onPress: () => getLogs(),
        },
    ];
    if (logs.length > 0)
        actionItems.push({
            icon: MailIcon,
            onPress: () => sendMail(),
        });
    actionItems.reverse();
    return (
        <CollapsibleHeaderLayout
            title={'Error Logs'}
            subtitle={'what went wrong'}
            refreshing={loading}
            showAuth={false}
            actionItems={actionItems}
            onRefresh={() => {
                getLogs();
            }}>
            <View style={[sharedStyles.paddingHorizontalMedium]}>
                <Body>{logs}</Body>
                <SEButton 
                    title={'SEND ERROR REPORT'} 
                    onPress={() => sendMail()} 
                />
                <SEButton
                    title={'LOG FAKE ERROR'}
                    onPress={() => {
                        Logger.logError({
                            code: 'XXX-999',
                            description: 'Fake error logged from logs screen.',
                            rawErrorCode: 'EXEC-999',
                            rawErrorMessage: 'Bad something happened',
                        });
                    }}
                />
                <SEButton title={'REFRESH'} onPress={() => getLogs()} />
                <SEButton title={'CLEAR'} onPress={() => Logger.clear('ERROR')} />
            </View>
        </CollapsibleHeaderLayout>
    );
};
