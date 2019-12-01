import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { sharedStyles } from '../../../styles';
import { SEHeader } from '../../../components';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

// TODO: Implement basic view
// TODO: Implement editing

export const AccountDetails = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            title={'Account Details'}
            subtitle={'...all about you'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
