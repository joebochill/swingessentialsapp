import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Home = () => (
    <View style={styles.container}>
        <Header navigation={{ icon: MenuIcon, onPress: () => {} }} title={'SWING ESSENTIALS'} />
        <EmptyState IconClass={AccessTime} title={'Coming Soon'} />
    </View>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
