import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { sharedStyles } from '../../../styles';
import { SEHeader } from '../../../components';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const ErrorLogs = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            title={'Error Logs'}
            subtitle={'...what went wrong'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
