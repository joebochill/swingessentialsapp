import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Order = withNavigation(props => (
    <View style={styles.container}>
        <Header
            navigation={{ icon: MenuIcon, onPress: () => props.navigation.openDrawer() }}
            title={'Order Lessons'}
            subtitle={'...multiple package options'}
        />
        <EmptyState
            IconClass={AccessTime}
            title={'Coming Soon'}
            actions={
                <Button
                    icon={<Icon name="add-circle-outline" color={'white'} />}
                    title="View Lesson"
                    onPress={() => props.navigation.navigate(ROUTES.LESSON)}
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
