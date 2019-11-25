import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const AccessTime = wrapIcon({ IconClass: Icon, name: 'access-time' });

export const SingleLesson = withNavigation(props => {
    // const { navigate } = useNavigation();
    return (
        <View style={styles.container}>
            <Header
                navigation={{ icon: MenuIcon, onPress: () => {} }}
                title={'08/19/2019'}
                subtitle={'In-person lesson'}
            />
            <EmptyState
                IconClass={AccessTime}
                title={'Coming Soon'}
                actions={
                    <Button
                        icon={<Icon name="add-circle-outline" color={'white'} />}
                        title="Go Back"
                        onPress={() => props.navigation.goBack()}
                    />
                }
            />
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
