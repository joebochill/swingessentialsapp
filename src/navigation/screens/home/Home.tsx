import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { tsPropertySignature } from '@babel/types';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Home = withNavigation((props) => (
    <View style={styles.container}>
        <Header 
            navigation={{ icon: MenuIcon, onPress: () => props.navigation.openDrawer() }} 
            title={'SWING ESSENTIALS'} />
        <EmptyState IconClass={AccessTime} title={'Coming Soon'} />
    </View>
));
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
