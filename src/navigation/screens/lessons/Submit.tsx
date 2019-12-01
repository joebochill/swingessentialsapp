import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import bg from '../../../images/bg_5.jpg';
import { SEHeader } from '../../../components';
import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

// TODO: Implement from camera Roll

export const Submit = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            expandable
            startExpanded
            backgroundImage={bg}
            title={'Submit Your Swing'}
            subtitle={'...create a new lesson'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
