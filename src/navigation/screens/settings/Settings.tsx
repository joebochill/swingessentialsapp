import * as React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
import {SEHeader} from '../../../components';
import { ROUTES } from '../../../constants/routes';
import { sharedStyles } from '../../../styles';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Settings = withNavigation(props => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader
            expandable
            title={'Settings'}
            subtitle={'...customize your experience'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
            actions={
                <Button
                    icon={<Icon name="add-circle-outline" color={'white'} />}
                    title="View Setting"
                    onPress={() => props.navigation.navigate(ROUTES.SETTING)}
                />
            }
        />
    </View>
));
