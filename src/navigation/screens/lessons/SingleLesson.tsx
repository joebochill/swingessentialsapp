import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { sharedStyles } from '../../../styles';
import { SEHeader } from '../../../components';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const SingleLesson = (props) => {
    // const { navigate } = useNavigation();
    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                expandable
                mainAction={'back'}
                title={'08/19/2019'}
                subtitle={'In-person lesson'}
            />
            <EmptyState
                IconClass={AccessTime}
                title={'Coming Soon'}
            />
        </View>
    );
};