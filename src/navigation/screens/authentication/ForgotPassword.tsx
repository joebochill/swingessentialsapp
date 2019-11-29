import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { sharedStyles } from '../../../styles';
import { SEHeader } from '../../../components';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const ForgotPassword = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            mainAction={'back'}
            showAuth={false}
            title={'Forgot Password'}
            subtitle={'...request a reset'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
