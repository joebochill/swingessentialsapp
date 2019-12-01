import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { SEHeader } from '../../../components';
import bg from '../../../images/bg_6.jpg';
import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

// TODO: Implement

export const Order = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            expandable
            startExpanded
            backgroundImage={bg}
            title={'Order Lessons'}
            subtitle={'...multiple package options'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
