import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { SEHeader } from '../../../components/index';

import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const SingleSetting = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            mainAction={'back'}
            title={'Single Setting'}
            subtitle={'...'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
        />
    </View>
);
