import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import topology from '../../../images/topology_40.png';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const Home = withNavigation((props) => (
    <View style={styles.container}>
        <Header 
            navigation={{ icon: MenuIcon, onPress: () => props.navigation.openDrawer() }} 
            backgroundImage={topology}
            backgroundColor={'#4f4c81'}
            title={'SWING ESSENTIALS'} 
            subtitle={'A PGA Pro in your pocket'}
        />
        <EmptyState IconClass={AccessTime} title={'Coming Soon'} />
    </View>
));
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
