import * as React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
import {SEHeader} from '../../../components';
import bg from '../../../images/bg_4.jpg';

import { ROUTES } from '../../../constants/routes';
import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Tips = withNavigation(props => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            expandable
            startExpanded
            backgroundImage={bg}
            title={'Tip of the Month'}
            subtitle={'...small adjustments, big difference'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
            actions={
                <Button
                    icon={<Icon name="add-circle-outline" color={'white'} />}
                    title="View Tip"
                    onPress={() => props.navigation.navigate(ROUTES.TIP)}
                />
            }
        />
    </View>
));
