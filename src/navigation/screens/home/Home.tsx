import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Header } from '@pxblue/react-native-components';
import { wrapIcon } from '@pxblue/react-native-components';
import * as Typography from '@pxblue/react-native-components/core/typography';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import YouTube from 'react-native-youtube';
import topology from '../../../images/topology_40.png';
import { ScrollView } from 'react-native-gesture-handler';
import { ROUTES } from '../../../constants/routes';
import { useSelector, useDispatch } from 'react-redux';
import { requestLogout } from '../../../redux/actions';

// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: Icon, name: 'person' });

export const Home = withNavigation(props => {
    const token = useSelector(state => state.login.token);
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <Header
                expandable
                navigation={{ icon: MenuIcon, onPress: () => props.navigation.openDrawer() }}
                backgroundImage={topology}
                // backgroundColor={'#4f4c81'}
                title={'SWING ESSENTIALS'}
                subtitle={'A PGA Pro in your pocket'}
                actionItems={[
                    token
                        ? {
                              icon: LogoutIcon,
                              onPress: () => {
                                  Alert.alert('Log Out', 'Are you sure you want to log out?', [
                                      { text: 'Log Out', onPress: () => dispatch(requestLogout(token)) },
                                      { text: 'Cancel' },
                                  ]);
                              },
                          }
                        : { icon: AccountIcon, onPress: () => props.navigation.push(ROUTES.AUTH_GROUP) },
                ]}
            />
            <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        marginHorizontal: 16,
                    }}>
                    <Typography.H7>Latest Lesson</Typography.H7>
                    <Typography.Body>05/21/2019</Typography.Body>
                </View>
                <YouTube
                    videoId="l3Y3iJa6DvE" // The YouTube video ID
                    play={false} // control playback of video with true/false
                    fullscreen={false} // control whether the video should play in fullscreen or inline
                    loop={false} // control whether the video should loop when ended
                    showinfo={false}
                    modestbranding={true}
                    controls={2}
                    rel={false}
                    style={{ marginHorizontal: 16, width: 382, height: 215 }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginTop: 32,
                        marginBottom: 8,
                        marginHorizontal: 16,
                    }}>
                    <Typography.H7>Redeem Credits</Typography.H7>
                </View>
                <ListItem
                    containerStyle={{ paddingHorizontal: 16 }}
                    bottomDivider
                    chevron={true}
                    onPress={() => props.navigation.navigate(ROUTES.SUBMIT)}
                    title={
                        <Typography.Body font={'regular'} style={{ marginLeft: 16 }}>
                            Individual Lessons
                        </Typography.Body>
                    }
                    rightTitle={'3 Left'}
                    leftIcon={{
                        name: 'golf-course',
                        color: '#231f61',
                    }}
                />
                <ListItem
                    disabled
                    disabledStyle={{ opacity: 0.7 }}
                    containerStyle={{ paddingHorizontal: 16 }}
                    bottomDivider
                    chevron={true}
                    onPress={() => {}}
                    title={
                        <Typography.Body font={'regular'} style={{ marginLeft: 16 }}>
                            Activate Unlimited
                        </Typography.Body>
                    }
                    rightTitle={'0 Left'}
                    leftIcon={{
                        type: 'material-community',
                        name: 'infinity',
                        color: '#231f61',
                    }}
                />
                <ListItem
                    containerStyle={{ paddingHorizontal: 16 }}
                    bottomDivider
                    chevron={true}
                    onPress={() => props.navigation.navigate(ROUTES.ORDER)}
                    title={
                        <Typography.Body font={'regular'} style={{ marginLeft: 16 }}>
                            Order More
                        </Typography.Body>
                    }
                    leftIcon={{
                        name: 'shopping-cart',
                        color: '#231f61',
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        marginHorizontal: 16,
                        marginTop: 32,
                    }}>
                    <Typography.H7>Tip of the Month</Typography.H7>
                    <Typography.Body>August 2019</Typography.Body>
                </View>
                <YouTube
                    videoId="dS2kXtp4bq0" // The YouTube video ID
                    play={false} // control playback of video with true/false
                    fullscreen={false} // control whether the video should play in fullscreen or inline
                    loop={false} // control whether the video should loop when ended
                    showinfo={false}
                    modestbranding={true}
                    controls={2}
                    rel={false}
                    style={{ marginHorizontal: 16, width: 382, height: 215 }}
                />
                <SafeAreaView />
            </ScrollView>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
});
