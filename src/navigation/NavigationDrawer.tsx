import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import {
    Animated,
    AppState,
    AppStateStatus,
    Image,
    FlatList,
    Linking,
    SafeAreaView,
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import { NavigationItems } from './NavigationContent';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
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
import { useListStyles, useFlexStyles } from '../styles';
import { useTheme, List, Divider } from 'react-native-paper';

import { unit } from '../styles/sizes';

// Utilities
import { getLongDate } from '../utilities';
import { height } from '../utilities/dimensions';
import { Logger } from '../utilities/logging';

// Redux
import { ApplicationState } from 'src/__types__';
import { loadUserContent, requestLogout } from '../redux/actions';

// Icons
import se from '../images/logo-small.png';

export const NavigationDrawer = props => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);

    const dispatch = useDispatch();
    const [scrollY] = useState(new Animated.Value(0));
    const [activePanel, setActivePanel] = useState(0);
    const [left] = useState({
        main: new Animated.Value(0),
        account: new Animated.Value(0),
        help: new Animated.Value(-1 * DRAWER_WIDTH),
    });
    const userData = useSelector((state: ApplicationState) => state.userData);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const [appState, setAppState] = useState(AppState.currentState);

    const { navigation } = props;

    const userString = userData.username || 'Welcome!';
    const nameString =
        userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'New User';
    const memberString = `Joined ${userData.joined ? getLongDate(userData.joined * 1000) : getLongDate(Date.now())}`;

    const scaleByHeight = useCallback(
        (atLarge, atSmall) => {
            return scrollY.interpolate({
                inputRange: [0, HEADER_EXPANDED_HEIGHT_NO_STATUS - HEADER_COLLAPSED_HEIGHT_NO_STATUS],
                outputRange: [atLarge, atSmall],
                extrapolate: 'clamp',
            });
        },
        [scrollY],
    );

    useEffect(() => {
        // handle launching from a deep link
        Linking.getInitialURL()
            .then(url => {
                if (url) {
                    let path: any = url.split('/').filter(el => el.length > 0);
                    _linkRoute(url, path);
                }
            })
            .catch(err => {
                Logger.logError({
                    code: 'DRW999',
                    description: 'Deep link failed to launch the app',
                    rawErrorMessage: err.message,
                });
            });
    }, []);

    // Handle the app coming into the foreground after being backgrounded
    const _handleAppStateChange = useCallback(
        (nextAppState: AppStateStatus) => {
            if (appState.match(/inactive|background/) && nextAppState === 'active' && token) {
                dispatch(loadUserContent());
            }
            setAppState(nextAppState);
        },
        [appState, token],
    );

    const _linkRoute = useCallback(
        (url: string, path: string) => {
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
        },
        [token, navigation],
    );

    // Handles activating a deep link while the app is in the background
    const _wakeupByLink = useCallback(
        event => {
            let path = event.url.split('/').filter(el => el.length > 0);
            _linkRoute(event.url, path);
        },
        [_linkRoute],
    );

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
    }, [activePanel, left.account, left.help, left.main]);

    useEffect(() => {
        // Set Up the State Change listeners
        AppState.addEventListener('change', _handleAppStateChange);
        Linking.addEventListener('url', _wakeupByLink);

        // Handle the case where the application is opened from a Universal Link
        // if (Platform.OS !== 'ios') {
        //     Linking.getInitialURL()
        //         .then(url => {
        //             if (url) {
        //                 let path = url.split('/').filter(el => el.length > 0);
        //                 _linkRoute(url, path);
        //             }
        //         })
        //         .catch((): void => {
        //             Logger.logError({
        //                 code: 'DRW100',
        //                 description: 'Deep link failed to load',
        //             });
        //         });
        // }

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
            Linking.removeEventListener('url', _wakeupByLink);
        };
    }, [_handleAppStateChange, _linkRoute, _wakeupByLink]);

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
                    <Animated.View
                        style={[
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
                                        height: scaleByHeight(unit(80), 0),
                                        width: scaleByHeight(unit(80), 0),
                                    },
                                ]}>
                                <Image
                                    resizeMethod="resize"
                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                    source={se}
                                />
                            </Animated.View>
                        </View>
                        <Animated.View
                            style={[styles.headerText, { marginLeft: scaleByHeight(theme.spaces.medium, 0) }]}>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(unit(24), 0.1),
                                    fontSize: scaleByHeight(unit(24), 0.1),
                                    fontWeight: '600',
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                                {userString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(unit(16), 0.1),
                                    fontSize: scaleByHeight(unit(16), 0.1),
                                    fontWeight: '500',
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                                {nameString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    lineHeight: scaleByHeight(unit(14), 0.1),
                                    fontSize: scaleByHeight(unit(14), 0.1),
                                    opacity: scaleByHeight(1, 0),
                                    fontWeight: '300',
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                                {memberString}
                            </Animated.Text>
                        </Animated.View>
                    </Animated.View>
                    <View style={[styles.footer]}>
                        <H7 font={'semiBold'} style={{ color: theme.colors.onPrimary }}>
                            SWING ESSENTIALS
                        </H7>
                        <Animated.View style={{ opacity: scaleByHeight(1, 0) }}>
                            <Body style={{ color: theme.colors.onPrimary }} font={'light'}>{`v${APP_VERSION}`}</Body>
                        </Animated.View>
                    </View>
                </View>
            }>
            <View style={[styles.drawerBody, { marginTop: -1 * theme.spaces.medium }]}>
                {NavigationItems.map((panel, ind) => {
                    const leftPosition = ind === 2 ? left.help : ind === 1 ? left.account : left.main;
                    let panelData = [...panel.data];
                    panelData = token ? panelData : panelData.filter(item => !item.private);
                    if (ind === 0) {
                        panelData.push({
                            title: token ? 'Sign Out' : 'Sign In',
                            icon: token ? 'exit-to-app' : 'person',
                            onPress: token
                                ? () => {
                                      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                          {
                                              text: 'Sign Out',
                                              onPress: () => {
                                                  dispatch(requestLogout());
                                                  navigation.closeDrawer();
                                              },
                                          },
                                          { text: 'Cancel' },
                                      ]);
                                  }
                                : () => navigation.navigate(ROUTES.LOGIN),
                        });
                    }
                    return (
                        <Animated.View key={`Panel_${panel.name}`} style={[styles.panel, { left: leftPosition }]}>
                            <FlatList
                                data={ind === activePanel ? panelData : []}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={({ item }) => (
                                    <>
                                        <List.Item
                                            title={item.title}
                                            titleEllipsizeMode={'tail'}
                                            left={() => (
                                                <List.Icon
                                                    icon={({ size, color }) => (
                                                        <MatIcon name={item.icon} size={size} color={color} />
                                                    )}
                                                />
                                            )}
                                            onPress={
                                                item.route
                                                    ? item.route === ROUTES.HOME
                                                        ? () => {
                                                              navigation.closeDrawer();
                                                          }
                                                        : () => {
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
                                            style={[
                                                listStyles.item,
                                                { paddingLeft: 0, paddingVertical: 0, minHeight: 'auto' },
                                            ]}
                                            titleStyle={{
                                                marginLeft: theme.spaces.small,
                                                fontSize: theme.fontSizes[16],
                                            }}
                                            right={
                                                item.nested
                                                    ? ({ style, ...rightProps }) => (
                                                          <View style={[flexStyles.row, style]} {...rightProps}>
                                                              <MatIcon
                                                                  name={'chevron-right'}
                                                                  size={theme.sizes.small}
                                                                  color={theme.colors.accent}
                                                                  style={{
                                                                      marginRight: -1 * theme.spaces.small,
                                                                  }}
                                                              />
                                                          </View>
                                                      )
                                                    : undefined
                                            }
                                        />
                                        <Divider />
                                    </>
                                )}
                            />
                        </Animated.View>
                    );
                })}
            </View>
            <View style={{ height: height * 0.2 }} />
            <SafeAreaView />
            <TokenModal />
        </CollapsibleHeaderLayout>
    );
};

const useStyles = (theme: Theme) =>
    StyleSheet.create({
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
            paddingVertical: theme.spaces.medium,
            paddingHorizontal: theme.spaces.medium,
            flexDirection: 'row',
        },
        headerText: {
            flex: 1,
            justifyContent: 'center',
        },
        navLabel: {
            marginLeft: theme.spaces.medium,
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
            padding: theme.spaces.medium,
        },
    });
