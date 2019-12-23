import * as React from 'react';

// Components
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { SEHeader } from '../../components';

// Styles
import { sharedStyles } from '../../styles';

// Icons
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

// TODO: Implement

export const Contact = () => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader expandable title={'Contact Us'} subtitle={'questions, comments, feedback'} />
        <EmptyState IconClass={AccessTime} title={'Coming Soon'} />
    </View>
);
