import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import {SEHeader} from '../../../components';
import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Register = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            expandable
            mainAction={'back'}
            showAuth={false}
            title={'Sign Up'}
            subtitle={'...create an account'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
