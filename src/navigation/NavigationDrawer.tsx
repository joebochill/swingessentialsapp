import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
// Components
import {
    Animated,
    AppState,
    AppStateStatus,
    Image,
    FlatList,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { NavigationItems } from './NavigationContent';
import { ListItem } from 'react-native-elements';
import { Body, H7, TokenModal, CollapsibleHeaderLayout } from '../components';

// Constants
import {
    APP_VERSION,
    HEADER_COLLAPSED_HEIGHT_NO_STATUS,
    HEADER_EXPANDED_HEIGHT_NO_STATUS,
    DRAWER_WIDTH,
} from '../constants';
import { ROUTES } from '../constants/routes';

// Styles
import { sharedStyles } from '../styles';
// import { white } from '../styles/colors';
import { useTheme } from '../styles/theme';

import { unit, spaces } from '../styles/sizes';

// Utilities
import { getLongDate } from '../utilities';
import { height } from '../utilities/dimensions';
import { Logger } from '../utilities/logging';

// Redux
import { ApplicationState } from 'src/__types__';

// Icons
import se from '../images/logo-small.png';

export const NavigationDrawer = (props) => {
    const theme = useTheme();
    const [scrollY] = useState(new Animated.Value(0));
    const [activePanel, setActivePanel] = useState(0);
    const [left] = useState({
        main: new Animated.Value(0),
        account: new Animated.Value(0),
        help: new Animated.Value(-1 * DRAWER_WIDTH),
    })
    const userData = useSelector((state: ApplicationState) => state.userData);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const [appState, setAppState] = useState(AppState.currentState);

    const { navigation } = props;

    const userString = userData.username || 'Welcome!';
    const nameString = userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'New User';
    const initials = userData.firstName && userData.lastName ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}` : 'SE';
    const memberString = `Member Since ${userData.joined ? getLongDate(userData.joined * 1000) : getLongDate(Date.now())}`

    const scaleByHeight = useCallback((atLarge, atSmall) => {
        return scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT_NO_STATUS - HEADER_COLLAPSED_HEIGHT_NO_STATUS],
            outputRange: [atLarge, atSmall],
            extrapolate: 'clamp',
        });
    }, [scrollY]);


    // Handle the app coming into the foreground after being backgrounded
    const _handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active' && token) {
            // TODO: Refresh data from the token
        }
        setAppState(nextAppState);
    }, [appState, token]);

    const _linkRoute = useCallback((url: string, path: string) => {
        if (url.match(/\/lessons\/?/gi)) {
            if (token) {
                navigation.navigate(ROUTES.LESSONS);
            }
        } else if (url.match(/\/register\/[A-Z0-9]+\/?$/gi)) {
            navigation.navigate(ROUTES.REGISTER, { code: path[path.length - 1] });
        } else if (url.match(/\/register\/?$/gi)) {
            navigation.navigate(ROUTES.REGISTER);
        }
        // TODO: Reset Password (needs to be added to app site association first)
    }, [token, navigation]);

    // Handles activating a deep link while the app is in the background
    const _wakeupByLink = useCallback((event) => {
        let path = event.url.split('/').filter(el => el.length > 0);
        _linkRoute(event.url, path);
    }, [_linkRoute]);

    useEffect(() => {
        // animate drawer panels
        const mainToValue = activePanel === 0 ? 0 : -1 * DRAWER_WIDTH;
        const accountToValue = activePanel === 1 ? -1 * DRAWER_WIDTH : 0;
        const helpToValue = activePanel === 2 ? -2 * DRAWER_WIDTH : -1 * DRAWER_WIDTH;

        Animated.timing(left.main, {
            toValue: mainToValue,
            duration: 250,
        }).start();
        Animated.timing(left.account, {
            toValue: accountToValue,
            duration: 250,
        }).start();
        Animated.timing(left.help, {
            toValue: helpToValue,
            duration: 250,
        }).start();
    }, [activePanel])

    useEffect(() => {
        // Set Up the State Change listeners
        AppState.addEventListener('change', _handleAppStateChange);
        Linking.addEventListener('url', _wakeupByLink);

        // Handle the case where the application is opened from a Universal Link
        if (Platform.OS !== 'ios') {
            Linking.getInitialURL()
                .then(url => {
                    if (url) {
                        let path = url.split('/').filter(el => el.length > 0);
                        _linkRoute(url, path);
                    }
                })
                .catch((): void => {
                    Logger.logError({
                        code: 'DRW100',
                        description: 'Deep link failed to load',
                    });
                });
        }
    }, [])


    return (
        <CollapsibleHeaderLayout
            title={''}
            info={''}
            mainAction={'none'}
            onResize={(scroll: Animated.Value) => {
                scrollY.setValue(scroll._value);
            }}
            subtitle={''}
            headerContent={
                <View style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Animated.View style={[
                        styles.content,
                        {
                            flex: 1,
                            opacity: scaleByHeight(1, 0),
                            overflow: 'hidden',
                        },
                    ]}>
                        <View style={[styles.avatarContainer]}>
                            <Animated.View
                                style={[
                                    styles.avatar,
                                    {
                                        backgroundColor: theme.colors.background,
                                        height: scaleByHeight(80, 0),
                                        width: scaleByHeight(80, 0),
                                    },
                                ]}>
                                {token ?
                                    <Animated.Text
                                        adjustsFontSizeToFit
                                        allowFontScaling
                                        style={{
                                            fontSize: scaleByHeight(40, 0),
                                            color: theme.colors.text[500],
                                        }}>
                                        {initials.toUpperCase()}
                                    </Animated.Text>
                                    :
                                    <Image
                                        resizeMethod='resize'
                                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                        source={se}
                                    />
                                }
                            </Animated.View>
                        </View>
                        <Animated.View
                            style={[styles.headerText, { marginLeft: scaleByHeight(spaces.medium, 0) }]}>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(24, 0.1),
                                    fontSize: scaleByHeight(24, 0.1),
                                    fontWeight: '600',
                                }} numberOfLines={1} ellipsizeMode={'tail'}
                            >
                                {userString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(16, 0.1),
                                    fontSize: scaleByHeight(16, 0.1),
                                    fontWeight: '500',
                                }}
                                numberOfLines={1} ellipsizeMode={'tail'}
                            >
                                {nameString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(10, 0.1),
                                    fontSize: scaleByHeight(10, 0.1),
                                    opacity: scaleByHeight(1, 0),
                                    fontWeight: '300',
                                }}
                                numberOfLines={1} ellipsizeMode={'tail'}>
                                {memberString}
                            </Animated.Text>
                        </Animated.View>

                    </Animated.View>
                    <View style={[styles.footer]}>
                        <H7 style={{color: theme.colors.onPrimary[500]}}>SWING ESSENTIALS</H7>
                        <Animated.View style={{ opacity: scaleByHeight(1, 0) }}>
                            <Body style={{color: theme.colors.onPrimary[500]}} font={'light'} >{`v${APP_VERSION}`}</Body>
                        </Animated.View>
                    </View>
                </View>
            }
        >
            <View style={[styles.drawerBody, { marginTop: -1 * spaces.medium }]}>
                {NavigationItems.map((panel, ind) => {
                    const leftPosition = ind === 2 ? left.help : ind === 1 ? left.account : left.main;
                    let panelData = [...panel.data];
                    panelData = token ? panelData : panelData.filter(item => !item.private);
                    if (ind === 0) {
                        panelData.push({
                            title: token ? 'Log Out' : 'Log In',
                            iconType: token ? 'material-community' : 'material',
                            icon: token ? 'logout-variant' : 'person',
                            onPress: token
                                ? () => this._logout()
                                : () => navigation.navigate(ROUTES.LOGIN),
                        });
                    }
                    return (
                        <Animated.View
                            key={`Panel_${panel.name}`}
                            style={[styles.panel, { left: leftPosition }]}>
                            <FlatList
                                data={ind === activePanel ? panelData : []}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={({ item }) => (
                                    <ListItem
                                        containerStyle={sharedStyles.listItem}
                                        contentContainerStyle={sharedStyles.listItemContent}
                                        bottomDivider
                                        onPress={
                                            item.route
                                                ? () => {
                                                    navigation.navigate(item.route);
                                                }
                                                : item.activatePanel !== undefined
                                                    ? () => {
                                                        setActivePanel(item.activatePanel);
                                                    }
                                                    : item.onPress
                                                        ? () => item.onPress()
                                                        : undefined
                                        }
                                        title={<Body style={[styles.navLabel]}>{item.title}</Body>}
                                        leftIcon={{
                                            type: item.iconType || 'material',
                                            name: item.icon,
                                            color: theme.colors.text[500],
                                            iconStyle: { marginLeft: 0 },
                                        }}
                                        rightIcon={item.nested ? {
                                            name: 'chevron-right',
                                            color: theme.colors.text[500],
                                        } : undefined}
                                    />
                                )}
                            />
                        </Animated.View>
                    );
                })}
            </View>
            <View style={{ height: height * 0.2 }} />
            <SafeAreaView />
            <TokenModal />
        </CollapsibleHeaderLayout >
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        justifyContent: 'center',
    },
    avatar: {
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingVertical: spaces.medium,
        paddingHorizontal: spaces.medium,
        flexDirection: 'row',
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
    },
    navLabel: {
        marginLeft: spaces.medium,
    },
    drawerBody: {
        flexDirection: 'row',
    },
    panel: {
        width: DRAWER_WIDTH,
    },
    footer: {
        flex: 0,
        height: HEADER_COLLAPSED_HEIGHT_NO_STATUS,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spaces.medium,
    },
});