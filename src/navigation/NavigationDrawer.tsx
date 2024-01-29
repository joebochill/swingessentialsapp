import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { Animated, AppState, AppStateStatus, Image, FlatList, Linking, SafeAreaView, View, Alert } from 'react-native';
import { NavigationItems } from './NavigationContent';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { Typography, TokenModal, CollapsibleHeaderLayout, Stack, ListItem } from '../components';

// Constants
import {
    APP_VERSION,
    HEADER_COLLAPSED_HEIGHT_NO_STATUS,
    HEADER_EXPANDED_HEIGHT_NO_STATUS,
    DRAWER_WIDTH,
} from '../constants';
import { ROUTES } from '../constants/routes';

// Styles
import { List, Divider } from 'react-native-paper';

// Utilities
import { getLongDate } from '../utilities';
import { height } from '../utilities/dimensions';
import { Logger } from '../utilities/logging';

// Redux
import { ApplicationState } from '../__types__';
import { loadUserContent, requestLogout } from '../redux/actions';

// Icons
import se from '../images/logo-small.png';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppTheme } from '../theme';
import { lightType, semiBoldType } from '../theme/typography/fontConfig';

export const NavigationDrawer: React.FC<DrawerContentComponentProps> = (props) => {
    const theme = useAppTheme();

    const dispatch = useDispatch();
    const [scrollY] = useState(new Animated.Value(0));
    const [activePanel, setActivePanel] = useState(0);
    const [left] = useState({
        main: new Animated.Value(0),
        account: new Animated.Value(0),
        help: new Animated.Value(-1 * DRAWER_WIDTH),
    });
    const userData = useSelector((state: ApplicationState) => state.userData);
    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const [appState, setAppState] = useState(AppState.currentState);

    const { navigation } = props;

    const userString = userData.username || 'Welcome!';
    const nameString =
        userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'New User';
    const memberString = `Joined ${userData.joined ? getLongDate(userData.joined * 1000) : getLongDate(Date.now())}`;
    const avatarURL = `https://www.swingessentials.com/images/profiles/${
        settings.avatar ? `${userData.username}/${settings.avatar}.png` : 'blank.png'
    }`;

    const scaleByHeight = useCallback(
        (atLarge: number, atSmall: number) =>
            scrollY.interpolate({
                inputRange: [0, HEADER_EXPANDED_HEIGHT_NO_STATUS - (HEADER_COLLAPSED_HEIGHT_NO_STATUS + 24)],
                outputRange: [atLarge, atSmall],
                extrapolate: 'clamp',
            }),
        [scrollY]
    );

    const linkRoute = useCallback(
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
        [token, navigation]
    );

    useEffect(() => {
        // handle launching from a deep link
        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    const path: any = url.split('/').filter((el) => el.length > 0);
                    linkRoute(url, path);
                }
            })
            .catch((err) => {
                void Logger.logError({
                    code: 'DRW999',
                    description: 'Deep link failed to launch the app',
                    rawErrorMessage: err.message,
                });
            });
    }, []);

    // Handle the app coming into the foreground after being backgrounded
    const handleAppStateChange = useCallback(
        (nextAppState: AppStateStatus) => {
            if (/inactive|background/.test(appState) && nextAppState === 'active' && token) {
                // @ts-ignore
                dispatch(loadUserContent());
            }
            setAppState(nextAppState);
        },
        [appState, token]
    );

    // Handles activating a deep link while the app is in the background
    const wakeUpByLink = useCallback(
        (event: any) => {
            const path = event.url.split('/').filter((el: string) => el.length > 0);
            linkRoute(event.url, path);
        },
        [linkRoute]
    );

    useEffect(() => {
        // animate drawer panels
        const mainToValue = activePanel === 0 ? 0 : -1 * DRAWER_WIDTH;
        const accountToValue = activePanel === 1 ? -1 * DRAWER_WIDTH : 0;
        const helpToValue = activePanel === 2 ? -2 * DRAWER_WIDTH : -1 * DRAWER_WIDTH;

        Animated.timing(left.main, {
            toValue: mainToValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        Animated.timing(left.account, {
            toValue: accountToValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        Animated.timing(left.help, {
            toValue: helpToValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [activePanel, left.account, left.help, left.main]);

    useEffect((): (() => void) => {
        // Set Up the State Change listeners
        const stateChangeListener = AppState.addEventListener('change', handleAppStateChange);
        const linkingListener = Linking.addEventListener('url', wakeUpByLink);

        return (): void => {
            stateChangeListener.remove();
            linkingListener.remove();
        };
    }, [handleAppStateChange, linkRoute, wakeUpByLink]);

    return (
        <CollapsibleHeaderLayout
            title={''}
            info={''}
            navigation={navigation}
            mainAction={'none'}
            onResize={(scroll: Animated.Value): void => {
                // @ts-ignore
                scrollY.setValue(scroll._value);
            }}
            subtitle={''}
            headerContent={
                <Stack justify={'flex-end'} style={{ width: '100%' }}>
                    <Animated.View
                        // TODO: Figure out why AnimatedStack doesn't work
                        // direction={'row'}
                        style={[
                            {
                                flex: 1,
                                flexDirection: 'row',
                                padding: theme.spacing.md,
                                opacity: scaleByHeight(1, 0),
                                overflow: 'hidden',
                            },
                        ]}
                    >
                        <Stack justify={'center'}>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={
                                    token
                                        ? (): void =>
                                              navigation.navigate(ROUTES.SETTINGS_GROUP, { screen: ROUTES.SETTINGS })
                                        : undefined
                                }
                            >
                                <Animated.View
                                    // align={'center'}
                                    // justify={'center'}
                                    style={[
                                        {
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme.colors.primaryContainer,
                                            height: scaleByHeight(80, 0),
                                            width: scaleByHeight(80, 0),
                                            borderRadius: scaleByHeight(80 / 2, 0),
                                            overflow: 'hidden',
                                        },
                                    ]}
                                >
                                    <Image
                                        resizeMethod="resize"
                                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                        source={settings.avatar ? { uri: avatarURL } : se}
                                    />
                                </Animated.View>
                            </TouchableHighlight>
                        </Stack>
                        <Animated.View
                            // justify={'center'}
                            style={[
                                {
                                    flex: 1,
                                    justifyContent: 'center',
                                    marginLeft: scaleByHeight(theme.spacing.md, 0),
                                },
                            ]}
                        >
                            <Animated.Text
                                style={{
                                    color: theme.colors.onPrimary,
                                    ...semiBoldType,
                                    lineHeight: scaleByHeight(24, 0.1),
                                    fontSize: scaleByHeight(24, 0.1),
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {userString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: theme.colors.onPrimary,
                                    ...semiBoldType,
                                    lineHeight: scaleByHeight(16, 0.1),
                                    fontSize: scaleByHeight(16, 0.1),
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {nameString}
                            </Animated.Text>
                            <Animated.Text
                                style={{
                                    color: theme.colors.onPrimary,
                                    ...lightType,
                                    lineHeight: scaleByHeight(14, 0.1),
                                    fontSize: scaleByHeight(14, 0.1),
                                    opacity: scaleByHeight(1, 0),
                                }}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {memberString}
                            </Animated.Text>
                        </Animated.View>
                    </Animated.View>
                    <Stack
                        direction={'row'}
                        align={'center'}
                        justify={'space-between'}
                        style={{
                            flex: 0,
                            padding: theme.spacing.md,
                            height: HEADER_COLLAPSED_HEIGHT_NO_STATUS,
                        }}
                    >
                        <Typography fontWeight={'semiBold'} color={'onPrimary'}>
                            SWING ESSENTIALS®
                        </Typography>
                        <Animated.View style={{ opacity: scaleByHeight(1, 0) }}>
                            <Typography color={'onPrimary'} fontWeight={'light'}>{`v${APP_VERSION}`}</Typography>
                        </Animated.View>
                    </Stack>
                </Stack>
            }
        >
            <Stack
                direction={'row'}
                // style={[
                //     { marginTop: -1 * theme.spacing.md }
                // ]}
            >
                {NavigationItems.map((panel, ind) => {
                    const leftPosition = ind === 2 ? left.help : ind === 1 ? left.account : left.main;
                    let panelData = [...panel.data];
                    panelData = token ? panelData : panelData.filter((item) => !item.private);
                    if (ind === 0) {
                        panelData.push({
                            title: token ? 'Sign Out' : 'Sign In',
                            icon: token ? 'exit-to-app' : 'person',
                            onPress: token
                                ? (): void => {
                                      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                          {
                                              text: 'Sign Out',
                                              onPress: (): void => {
                                                  // @ts-ignore
                                                  dispatch(requestLogout());
                                                  navigation.closeDrawer();
                                              },
                                          },
                                          { text: 'Cancel' },
                                      ]);
                                  }
                                : (): void => navigation.navigate(ROUTES.LOGIN),
                        });
                    }
                    return (
                        <Animated.View
                            key={`Panel_${panel.name}`}
                            style={[{ width: DRAWER_WIDTH, left: leftPosition }]}
                        >
                            <FlatList
                                data={ind === activePanel ? panelData : []}
                                keyExtractor={(item, index): string => `${index}`}
                                renderItem={({ item }): JSX.Element => (
                                    <>
                                        <ListItem
                                            title={item.title}
                                            titleEllipsizeMode={'tail'}
                                            left={(): JSX.Element => (
                                                <List.Icon
                                                    icon={({ size, color }): JSX.Element => (
                                                        <MatIcon name={item.icon} size={size} color={color} />
                                                    )}
                                                />
                                            )}
                                            onPress={
                                                item.route
                                                    ? item.route === ROUTES.HOME
                                                        ? (): void => {
                                                              navigation.closeDrawer();
                                                          }
                                                        : item.screen
                                                        ? (): void => {
                                                              // @ts-ignore
                                                              navigation.navigate(item.route, { screen: item.screen });
                                                          }
                                                        : (): void => {
                                                              // @ts-ignore
                                                              navigation.navigate(item.route);
                                                          }
                                                    : item.activatePanel !== undefined
                                                    ? (): void => {
                                                          // @ts-ignore
                                                          setActivePanel(item.activatePanel);
                                                      }
                                                    : item.onPress
                                                    ? // @ts-ignore
                                                      (): void => item.onPress()
                                                    : undefined
                                            }
                                            style={[
                                                {
                                                    // paddingLeft: 0,
                                                    // paddingVertical: 0,
                                                    minHeight: 'auto',
                                                },
                                            ]}
                                            right={
                                                item.nested
                                                    ? ({ style, ...rightProps }): JSX.Element => (
                                                          <Stack
                                                              direction={'row'}
                                                              align={'center'}
                                                              style={[style]}
                                                              {...rightProps}
                                                          >
                                                              <MatIcon
                                                                  name={'chevron-right'}
                                                                  size={theme.size.sm}
                                                                  color={theme.colors.primary}
                                                                  style={{
                                                                      marginRight: -1 * theme.spacing.sm,
                                                                  }}
                                                              />
                                                          </Stack>
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
            </Stack>
            <View style={{ height: height * 0.2 }} />
            <SafeAreaView />
            <TokenModal />
        </CollapsibleHeaderLayout>
    );
};
