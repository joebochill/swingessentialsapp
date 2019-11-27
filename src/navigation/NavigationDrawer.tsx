import React from 'react';
import { connect } from 'react-redux';
import { Alert, Animated, SafeAreaView, StatusBar, View, Platform, FlatList, StyleSheet, ScrollView } from 'react-native';
import { APP_VERSION } from '../constants/index';
import { NavigationItems } from './NavigationContent';

import topology from '../images/topology.png';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Typography from '@pxblue/react-native-components/core/typography';
import { ListItem, Icon } from 'react-native-elements';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const HEADER_EXPANDED_HEIGHT = 200 + getStatusBarHeight();
const HEADER_COLLAPSED_HEIGHT = 56 + getStatusBarHeight();
const DRAWER_WIDTH = 350;

import { DrawerContentComponentProps } from 'react-navigation-drawer';
import { ROUTES } from '../constants/routes';
import { purple } from '../styles/colors';
import { getLongDate } from '../utilities/general';
import { requestLogout, requestLogin } from '../redux/actions';

type NavigatorProps = DrawerContentComponentProps & {
    username: string;
    first: string;
    last: string;
    token: string;
    logout: Function;
}
type NavigatorState = {
    scrollY: Animated.Value;
    activePanel: 0 | 1 | 2;
    mainLeft: Animated.Value;
    accountLeft: Animated.Value;
    helpLeft: Animated.Value;
};

function mapStateToProps(state) {
    return {
        username: state.userData.username,
        first: state.userData.firstName,
        last: state.userData.lastName,
        token: state.login.token,
        // lessons: state.lessons,
        // modalWarning: state.login.modalWarning
    };
}

const mapDispatchToProps = {
    logout: requestLogout,
}
export class NavigationDrawerClass extends React.Component<NavigatorProps, NavigatorState> {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            activePanel: 0,
            mainLeft: new Animated.Value(0),
            accountLeft: new Animated.Value(DRAWER_WIDTH),
            helpLeft: new Animated.Value(DRAWER_WIDTH),
        };
    }
    componentDidUpdate() {
        const { activePanel, mainLeft, accountLeft, helpLeft } = this.state;

        const mainToValue = activePanel === 0 ? 0 : -1 * DRAWER_WIDTH;
        Animated.timing(mainLeft, {
            toValue: mainToValue,
            duration: 250,
        }).start();
        const accountToValue = activePanel === 1 ? 0 : 1 * DRAWER_WIDTH;
        Animated.timing(accountLeft, {
            toValue: accountToValue,
            duration: 250,
        }).start();
        const helpToValue = activePanel === 2 ? 0 : 1 * DRAWER_WIDTH;
        Animated.timing(helpLeft, {
            toValue: helpToValue,
            duration: 250,
        }).start();
    }
    _logout() {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Log Out', onPress: () => this.props.logout(this.props.token) },
            { text: 'Cancel' },
        ]);
    }
    render() {
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);
        const { mainLeft, accountLeft, helpLeft } = this.state;
        const { username, first, last, token } = this.props;

        const userString = username || 'Welcome!'
        const nameString = (first && last) ? `${first} ${last}` : 'New User';
        const initials = (first && last) ? `${first.charAt(0)}${last.charAt(0)}` : 'SE';
        const memberData = this.props.joinDate || getLongDate(Date.now());

        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />
                <AnimatedSafeAreaView style={[styles.bar, { height: headerHeight }]}>
                    <Animated.Image
                        source={topology}
                        resizeMethod={'resize'}
                        onPress={() => this.props.navigation.navigate(ROUTES.HOME)}
                        style={[styles.image, { height: headerHeight }]}
                    />
                    <Animated.View style={[this.contentStyle()]}>
                        <View style={styles.avatarContainer}>
                            <Animated.View
                                style={[
                                    styles.avatar,
                                    {
                                        height: this.scaleByHeaderHeight(100, 0),
                                        width: this.scaleByHeaderHeight(100, 0),
                                    },
                                ]}>
                                <Animated.Text
                                    adjustsFontSizeToFit
                                    allowFontScaling
                                    style={{
                                        fontSize: this.scaleByHeaderHeight(32, 0),
                                        color: purple[500],
                                    }}>
                                    {initials.toUpperCase()}
                                </Animated.Text>
                            </Animated.View>
                        </View>
                        <Animated.View style={[styles.headerText, { marginLeft: this.scaleByHeaderHeight(16, 0) }]}>
                            <Animated.Text style={this.titleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {userString}
                            </Animated.Text>
                            <Animated.Text style={this.subtitleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {nameString}
                            </Animated.Text>
                            <Animated.Text style={this.infoStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {`Member Since ${memberData}`}
                            </Animated.Text>
                        </Animated.View>
                        <View style={styles.headerAction}>
                            {!token && <Icon onPress={() => this.props.navigation.navigate(ROUTES.LOGIN)} name={'person'} size={24} color={'white'} />}
                            {token && <Icon onPress={() => this._logout()} type={'material-community'} name={'logout-variant'} size={24} color={'white'} />}
                        </View>
                    </Animated.View>
                    <View style={styles.userInfo}>
                        <Typography.H7 color={'onPrimary'}>SWING ESSENTIALS</Typography.H7>
                        <Typography.Body color={'onPrimary'} font={'light'}>{`v${APP_VERSION}`}</Typography.Body>
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
                    <View style={styles.drawerBody}>
                        {NavigationItems.map((panel, ind) => {
                            const leftPosition = ind === 2 ? helpLeft : ind === 1 ? accountLeft : mainLeft;
                            const panelData = [...panel.data];
                            if (ind === 0) {
                                panelData.push({
                                    title: token ? 'Log Out' : 'Log In',
                                    iconType: token ? 'material-community' : 'material',
                                    icon: token ? 'logout-variant' : 'person',
                                    onPress: token ? () => this._logout() : () => this.props.navigation.navigate(ROUTES.LOGIN)
                                })
                            }
                            return (
                                <Animated.View
                                    key={`Panel_${panel.name}`}
                                    style={[styles.panel, { left: leftPosition }]}>
                                    <FlatList
                                        data={panelData}
                                        keyExtractor={(item, index) => `${index}`}
                                        renderItem={({ item }) => (
                                            <ListItem
                                                containerStyle={styles.navItem}
                                                bottomDivider
                                                chevron={item.nested}
                                                onPress={
                                                    item.route
                                                        ? () => {
                                                            this.props.navigation.navigate(item.route);
                                                            // this.setState({ activePanel: 0 });
                                                        }
                                                        : item.activatePanel !== undefined
                                                            ? () => {
                                                                this.setState({ activePanel: item.activatePanel });
                                                            }
                                                            : (item.onPress ? () => item.onPress() : undefined)
                                                }
                                                title={
                                                    <Typography.Body font={'regular'} style={styles.navLabel}>
                                                        {item.title}
                                                    </Typography.Body>
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
                                </Animated.View>
                            );
                        })}
                    </View>
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
export const NavigationDrawer = connect(mapStateToProps, mapDispatchToProps)(NavigationDrawerClass);

const styles = StyleSheet.create({
    avatarContainer: {
        justifyContent: 'center',
    },
    avatar: {
        borderRadius: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bar: {
        width: '100%',
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        position: 'absolute',
        justifyContent: 'flex-end',
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
    navItem: {
        paddingHorizontal: 16,
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
    },
    headerAction: {
        marginLeft: 16,
    },
    navLabel: {
        marginLeft: 16,
        color: '#231f61',
    },
    drawerBody: {
        flexDirection: 'row',
        position: 'relative',
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT,
    },
    image: {
        position: 'absolute',
        right: 0,
        opacity: 0.5,
        width: '100%',
        resizeMode: 'cover',
    },
    panel: {
        position: 'absolute',
        width: DRAWER_WIDTH,
    },
    userInfo: {
        flex: 0,
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
});
