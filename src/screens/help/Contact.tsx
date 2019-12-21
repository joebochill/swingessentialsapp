import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { SEHeader } from '../../components';
import { sharedStyles } from '../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

// TODO: Implement

export const Contact = () => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader expandable title={'Contact Us'} subtitle={'questions, comments, feedback'} />
        <EmptyState IconClass={AccessTime} title={'Coming Soon'} />
    </View>
);
