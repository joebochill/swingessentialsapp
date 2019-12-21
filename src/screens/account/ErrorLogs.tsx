import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Body } from '@pxblue/react-native-components';
import { sharedStyles } from '../../styles';
import { SEHeader, SEButton, CollapsibleHeaderLayout } from '../../components';
import { Logger } from '../../utilities/logging';
import { useDispatch, useSelector } from 'react-redux';
import { sendLogReport } from '../../redux/actions';
import { LOAD_LOGS } from '../../redux/actions/types';
import { ApplicationState } from 'src/__types__';

// TODO: Implement logging functionality
// TODO: Implement screen
// TODO: Implement sending logs

export const ErrorLogs = () => {
    const [logs, setLogs] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector((state: ApplicationState) => state.logs.loading);

    const getLogs = useCallback(async () => {
        dispatch({type: LOAD_LOGS.REQUEST});
        const logs = await Logger.readMessages('ERROR');
        dispatch({type: LOAD_LOGS.SUCCESS});
        setLogs(logs);
    }, [])
    
    useEffect(() => {
        getLogs();
    },[]);

    return (
        <CollapsibleHeaderLayout
            title={'Error Logs'}
            subtitle={'what went wrong'}
            refreshing={loading}
            onRefresh={() => {
                getLogs();
            }}
        >
            <View style={[sharedStyles.paddingHorizontalMedium]}>
                <Body>{logs}</Body>
                <SEButton
                    title={'SEND'}
                    onPress={() => dispatch(sendLogReport(logs, 'ERROR'))}
                />
                <SEButton
                    title={'LOG FAKE ERROR'}
                    onPress={() => {
                        Logger.logError({
                            code: 'XXX-999',
                            description: 'Fake error logged from logs screen.',
                            rawErrorCode: 'EXEC-999',
                            rawErrorMessage: 'Bad something happened',
                        })
                    }}
                />
            </View>
        </CollapsibleHeaderLayout>

        // <View style={sharedStyles.pageContainer}>
        //     <SEHeader title={'Error Logs'} subtitle={'what went wrong'} />
        //     <Body>{logs}</Body>
        //     <SEButton
        //         title={'SEND'}
        //         onPress={() => dispatch(sendLogReport(logs))}
        //     />
        //     <SEButton
        //         title={'LOG FAKE ERROR'}
        //         onPress={() => {
        //             Logger.logError({
        //                 code: 'XXX-999',
        //                 description: 'Fake error logged from logs screen.',
        //                 rawErrorCode: 'EXEC-999',
        //                 rawErrorMessage: 'Bad something happened',
        //             })
        //         }}
        //     />
        // </View>
    )
};
