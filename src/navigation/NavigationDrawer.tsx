import React from 'react'
import { AppState, Alert, Text, View, Platform, ScrollView, Image, Linking, Button } from 'react-native';
// import LogoutWarning from './Modal/TokenExpire';

import { colors, spacing } from '../styles/index';
import { scale, verticalScale } from '../styles/dimension';

// import logo from '../images/logo-big.png';

import ListItem from '../components/ListItem/ListItem';
import { APP_VERSION } from '../constants/index';
import { ROUTES } from '../constants/routes';

import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { NavigationDrawerProp, DrawerContentComponentProps } from 'react-navigation-drawer';
import { TouchableHighlight } from 'react-native-gesture-handler';

// type WithNavigation<T> = T & {
//     navigation: NavigationDrawerProp
// }
interface Lessons {
    pending: Array<any>,
    complete: Array<any>
}
interface DrawerProps extends DrawerContentComponentProps {
    // navigation: NavigationStackProp | NavigationSwitchProp | NavigationDrawerProp,
    modalWarning?: boolean,
    username: string,
    // navigation: NavigationStackProp | NavigationSwitchProp | NavigationDrawerProp,
    token?: string,
    lessons?: Lessons,
    requestLogout?: Function
}

class NavigationDrawer extends React.Component<DrawerProps> {
    // this navigation type warning should go away in an upcoming update to react-navigation types
    render() {
        return (
            <View style={{ flex: 1, width: '100%', backgroundColor: colors.backgroundGrey }}>
                <View style={{ height: verticalScale(80), padding: spacing.normal, paddingTop: spacing.large, paddingBottom: 0, backgroundColor: colors.lightPurple }}>
                    {/* <Image
                        //resizeMode='contain'
                        resizeMethod='resize'
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        source={logo}
                    /> */}
                </View>
                <View style={{ height: spacing.large, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightPurple }}>
                    <Text style={{ fontSize: scale(14), color: colors.white, marginTop: scale(-14) }}>{this.props.username ? 'Welcome, ' + this.props.username + '!' : ''}</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                    <View style={{ marginTop: spacing.normal }}>
                        <ListItem menuItem primary="Your Lessons"
                            customStyle={{ borderTopWidth: scale(1) }}
                            action={() => this.props.navigation.navigate('Lessons')} />
                        <ListItem menuItem primary="Submit Your Swing"
                            action={() => {
                                if (this.props.lessons.pending.length < 1) {
                                    this.props.navigation.navigate('RedeemTop');
                                }
                                else {
                                    Alert.alert(
                                        'Swing Analysis Pending',
                                        'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                        [{ text: 'OK' }]
                                    );
                                }
                            }}
                        />
                        <ListItem menuItem primary="Order Lessons"
                            action={() => this.props.navigation.navigate('Order')} />
                    </View>
                    <View>
                        <ListItem menuItem primary="Tip of the Month"
                            customStyle={{ borderTopWidth: scale(1) }}
                            action={() => this.props.navigation.navigate('Tips')} />
                        <ListItem menuItem primary="The 19th Hole"
                            action={() => this.props.navigation.navigate('Blogs')} />
                    </View>
                    <View style={{ marginBottom: spacing.normal }}>
                        {this.props.token &&
                            <ListItem menuItem primary="Sign Out"
                                customStyle={{ borderTopWidth: scale(1) }}
                                action={() => this.props.requestLogout(this.props.token)} />
                        }
                        {!this.props.token &&
                            <ListItem menuItem primary="Sign In / Register"
                                customStyle={{ borderTopWidth: scale(1) }}
                                action={() => this.props.navigation.navigate('Auth')} />
                        }
                        <ListItem menuItem primary="Help"
                            action={() => this.props.navigation.navigate('Help')} />
                        <ListItem menuItem primary="About" secondary={`v${APP_VERSION}`}
                            action={() => this.props.navigation.navigate('About')} />
                    </View>
                </ScrollView>
                {/* {this.props.token && this.props.modalWarning && <LogoutWarning />} */}
            </View>
        )
    }
}

export default withNavigation(NavigationDrawer);