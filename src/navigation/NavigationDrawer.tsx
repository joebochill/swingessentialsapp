import React from 'react';
import {
    Animated,
    SafeAreaView,
    StatusBar,
    Text,
    View,
    Platform,
    FlatList,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { APP_VERSION } from '../constants/index';
import { withNavigation } from 'react-navigation';

// import { ROUTES } from '../constants/routes';

import topology from '../images/topology.png';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Body } from '@pxblue/react-native-components';
import { ListItem, Icon } from 'react-native-elements';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const HEADER_EXPANDED_HEIGHT = 200 + getStatusBarHeight();
const HEADER_COLLAPSED_HEIGHT = 56 + getStatusBarHeight();

import { DrawerContentComponentProps } from 'react-navigation-drawer';
import { ROUTES } from '../constants/routes';

type Route = {
    title: string;
    icon: string;
    route?: string;
    iconType?: string;
    nested?: boolean;
    onPress?: Function;
}
type NavigatorState = {
    scrollY: Animated.Value;
    currentRoutes: Array<Route>
};

export class NavigationDrawer extends React.Component<DrawerContentComponentProps, NavigatorState> {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            currentRoutes: this.mainNavigationItems
        };
    }
    mainNavigationItems: Array<Route>  = [
        {
            title: 'Home',
            icon: 'home',
            route: ROUTES.HOME
        },
        {
            title: 'Your Lessons',
            icon: 'subscriptions',
            route: ROUTES.LESSONS
        },
        {
            title: 'Submit Your Swing',
            icon: 'videocam',
        },
        {
            title: 'Order More',
            icon: 'shopping-cart',
        },
        {
            title: 'Tip of the Month',
            iconType: 'material-community',
            icon: 'calendar-today',
        },
        {
            title: '19th Hole',
            iconType: 'material-community',
            icon: 'beer',
        },
        {
            title: 'My Account',
            icon: 'person',
            nested: true,
            onPress: () => this.setState({currentRoutes: this.accountNavigationItems})
        },
        {
            title: 'Help',
            icon: 'help',
            nested: true,
            onPress: () => this.setState({currentRoutes: this.helpNavigationItems})
        },
    ];
    helpNavigationItems: Array<Route>  = [
        {
            title: 'About',
            icon: 'info',
            route: ROUTES.ABOUT
        },
        {
            title: 'FAQ',
            icon: 'help',
            route: ROUTES.HELP
        },
        {
            title: 'Contact Us',
            icon: 'mail',
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            onPress: () => this.setState({currentRoutes: this.mainNavigationItems})
        },
    ];
    accountNavigationItems: Array<Route> = [
        {
            title: 'Account Details',
            icon: 'person',
            route: ROUTES.ACCOUNT_DETAILS
        },
        {
            title: 'Order History',
            icon: 'receipt',
            route: ROUTES.HISTORY
        },
        {
            title: 'Error Logs',
            icon: 'list',
            route: ROUTES.LOGS
        },
        {
            title: 'Settings',
            icon: 'settings',
            route: ROUTES.SETTINGS
        },
        {
            title: 'Log Out',
            iconType: 'material-community',
            icon: 'logout-variant',
        },
        {
            title: 'Back',
            icon: 'arrow-back',
            onPress: () => this.setState({currentRoutes: this.mainNavigationItems})
        },
    ];
    render() {
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);

        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />
                <AnimatedSafeAreaView
                    style={[
                        styles.bar,
                        {
                            justifyContent: 'flex-end',
                            height: headerHeight,
                            paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
                        },
                    ]}>
                    <Animated.Image
                        source={topology}
                        resizeMethod={'resize'}
                        onPress={() => this.props.navigation.navigate(ROUTES.HOME)}
                        style={[
                            styles.image,
                            {
                                height: headerHeight,
                                opacity: 0.5,
                            },
                        ]}
                    />
                    <Animated.View style={[this.contentStyle()]}>
                        <View style={{ justifyContent: 'center' }}>
                            <Animated.View
                                style={{
                                    height: this.scaleByHeaderHeight(100, 0),
                                    width: this.scaleByHeaderHeight(100, 0),
                                    borderRadius: 100,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Animated.Text
                                    adjustsFontSizeToFit
                                    allowFontScaling
                                    style={{
                                        fontSize: this.scaleByHeaderHeight(32, 0),
                                        color: '#4f4c81',
                                    }}>
                                    JB
                                </Animated.Text>
                            </Animated.View>
                        </View>
                        <Animated.View
                            style={{ flex: 1, justifyContent: 'center', marginLeft: this.scaleByHeaderHeight(16, 0) }}>
                            <Animated.Text style={this.titleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'joebochill'}
                            </Animated.Text>
                            <Animated.Text style={this.subtitleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'Joseph Boyle'}
                            </Animated.Text>
                            <Animated.Text style={this.infoStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'Member Since April 5, 1989'}
                            </Animated.Text>
                        </Animated.View>
                        <View style={{ marginLeft: 16 }}>
                            <Icon name={'person'} size={24} color={'white'} />
                        </View>
                    </Animated.View>
                    <View

                        style={{
                            flex: 0,
                            height: 56,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                        }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>SWING ESSENTIALS</Text>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '300' }}>{`v${APP_VERSION}`}</Text>
                    </View>
                </AnimatedSafeAreaView>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scrollY,
                                },
                            },
                        },
                    ])}
                    scrollEventThrottle={16}>
                    <FlatList
                        data={this.state.currentRoutes}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({ item }) => (
                            <ListItem
                                containerStyle={{ paddingHorizontal: 16 }}
                                bottomDivider
                                chevron={item.nested}
                                onPress={item.route ? () => this.props.navigation.navigate(item.route) : (item.onPress ? () => item.onPress() : undefined)}
                                title={
                                    <Body font={'regular'} style={{ marginLeft: 16, color: '#231f61' }}>
                                        {item.title}
                                    </Body>
                                }
                                leftIcon={{
                                    type: item.iconType || 'material',
                                    name: item.icon,
                                    color: '#231f61',
                                    iconStyle: { marginLeft: 0 },
                                }}
                            />
                        )}
                    />
                </ScrollView>
                <SafeAreaView />
            </View>
        );
    }
    scaleByHeaderHeight(atLarge: number, atSmall: number) {
        return this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [atLarge, atSmall],
            extrapolate: 'clamp',
        });
    }
    titleStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(24, 0.1),
            fontSize: this.scaleByHeaderHeight(24, 0.1),
            fontWeight: '600',
        };
    }
    subtitleStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(16, 0.1),
            fontSize: this.scaleByHeaderHeight(16, 0.1),
            fontWeight: '500',
        };
    }
    infoStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(10, 0.1),
            fontSize: this.scaleByHeaderHeight(10, 0.1),
            opacity: this.scaleByHeaderHeight(1, 0),
            fontWeight: '300',
        };
    }

    contentStyle() {
        return [
            styles.content,
            {
                flex: 1,
                opacity: this.scaleByHeaderHeight(1, 0),
                overflow: 'hidden',
            },
        ];
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bar: {
        width: '100%',
        position: 'absolute',
        zIndex: 1000,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 0,
        backgroundColor: '#4f4c81',
    },
    content: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT,
    },
    image: {
        position: 'absolute',
        right: 0,
        width: '100%',
        resizeMode: 'cover',
    },
});
