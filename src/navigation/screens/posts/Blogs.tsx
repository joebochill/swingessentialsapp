import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
import {SEHeader} from '../../../components';
import bg from '../../../images/bg_3.jpg';

import { ROUTES } from '../../../constants/routes';
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Blogs = withNavigation(props => (
    <View style={styles.container}>
        <SEHeader
            expandable
            startExpanded
            backgroundImage={bg}
            title={'19th Hole'}
            subtitle={'...Golf stories and Q&A'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
            actions={
                <Button
                    icon={<Icon name="add-circle-outline" color={'white'} />}
                    title="View Blog"
                    onPress={() => props.navigation.navigate(ROUTES.BLOG)}
                />
            }
        />
    </View>
));
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
