import React, { useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Header, wrapIcon } from '@pxblue/react-native-components';
import * as Typography from '@pxblue/react-native-components/core/typography';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { YouTube } from '../../../components';
import topology from '../../../images/topology_40.png';
// import topology from '../../../images/bg.jpg';
import { ScrollView } from 'react-native-gesture-handler';
import { ROUTES } from '../../../constants/routes';
import { useSelector, useDispatch } from 'react-redux';
import { requestLogout, loadLessons } from '../../../redux/actions';
import { getDate } from '../../../utilities/general';

// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: Icon, name: 'person' });

export const Home = withNavigation(props => {
    const token = useSelector(state => state.login.token);
    const lessons = useSelector(state => state.lessons);
    const tips = useSelector(state => state.tips.tipList);
    const credits = useSelector(state => state.credits);
    const dispatch = useDispatch();

    const latestLesson = lessons.closed.length > 0 ? lessons.closed[0] : {
        request_date: getDate(Date.now()),
        response_video: 'l3Y3iJa6DvE',
        response_notes: 'Welcome to the Swing Essentials family! We\'re super excited to have you aboard.|:::|Upload a video of your golf swing and we\'ll have a PGA-certified professional analyze your swing and provide a custom-tailored breakdown video highlighting what you\'re doing well, as well as areas you can work on to improve your game.',
        request_notes: '',
        fo_swing: '',
        dtl_swing: ''
    };

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
                    { icon: MenuIcon, onPress: () => dispatch(loadLessons()) },
                ]}
            />
            <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                <>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                            marginHorizontal: 16,
                        }}>
                        <Typography.H7>Latest Lesson</Typography.H7>
                        <Typography.Body>{latestLesson.request_date}</Typography.Body>
                    </View>
                    <YouTube
                        videoId={latestLesson.response_video}
                        style={{ marginHorizontal: 16, width: 382, height: 215 }}
                    />
                </>
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
                    rightTitle={`${credits.count} Left`}
                    disabled={credits.count < 1}
                    disabledStyle={{ opacity: 0.7 }}
                    leftIcon={{
                        name: 'golf-course',
                        color: '#231f61',
                    }}
                />
                <ListItem
                    disabled={credits.unlimited < 1 || credits.unlimitedActive}
                    disabledStyle={{ opacity: 0.7 }}
                    containerStyle={{ paddingHorizontal: 16 }}
                    bottomDivider
                    chevron={true}
                    onPress={() => { }}
                    title={
                        <Typography.Body font={'regular'} style={{ marginLeft: 16 }}>
                            Activate Unlimited
                        </Typography.Body>
                    }
                    rightTitle={`${credits.unlimited} Left`}
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

                {tips.length > 0 && <>
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
                        <Typography.Body>{tips[0].date}</Typography.Body>
                    </View>
                    <YouTube
                        videoId={tips[0].video}
                        style={{ marginHorizontal: 16, width: 382, height: 215 }}
                    />
                </>}
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
