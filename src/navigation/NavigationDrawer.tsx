import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Animated, AppState, AppStateStatus, Image, Alert, ScrollView } from 'react-native';
import { NavigationItems } from './NavigationContent';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { Typography, TokenModal, Stack, ListItem } from '../components';
import { APP_VERSION, DRAWER_WIDTH } from '../constants';
import { ROUTES } from '../constants/routes';
import { List } from 'react-native-paper';
import { getLongDate } from '../utilities';
import { ApplicationState } from '../__types__';
import { loadUserContent, requestLogout } from '../redux/actions';
import se from '../images/logo-small.png';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppTheme } from '../theme';
import { lightType, semiBoldType } from '../theme/typography/fontConfig';
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT, Header, useCollapsibleHeader } from '../components/CollapsibleHeader';

export const NavigationDrawer: React.FC<DrawerContentComponentProps> = (props) => {
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

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
                inputRange: [0, EXPANDED_HEIGHT - (COLLAPSED_HEIGHT + 16)],
                outputRange: [atLarge, atSmall],
                extrapolate: 'clamp',
            }),
        [scrollY]
    );

    // Handle the app coming into the foreground after being backgrounded
    const handleAppStateChange = useCallback(
        (nextAppState: AppStateStatus) => {
            if (/inactive|background/.test(appState) && nextAppState === 'active' && token) {
                // @ts-ignore
                dispatch(loadUserContent());
            }
            setAppState(nextAppState);
        },
        [appState, token, dispatch]
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

        return (): void => {
            stateChangeListener.remove();
        };
    }, [handleAppStateChange]);

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: scrollY,
                    },
                },
            },
        ],
        {
            useNativeDriver: false,
        }
    );

    return (
        <>
            <ScrollView
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                onScroll={(e) => {
                    handleScroll(e);
                    scrollProps.onScroll(e);
                }}
            >
                <Stack direction={'row'}>
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
                                <Stack>
                                    {(ind === activePanel ? panelData : []).map((item, index) => (
                                        <ListItem
                                            key={index}
                                            bottomDivider
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
                                                              navigation.navigate(item.route, {
                                                                  screen: item.screen,
                                                              });
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
                                    ))}
                                </Stack>
                            </Animated.View>
                        );
                    })}
                </Stack>
            </ScrollView>
            <Header
                title={''}
                navigation={navigation}
                mainAction={'none'}
                content={
                    <Stack justify={'flex-end'} style={{ flex: 1, marginRight: -1 * theme.size.md }}>
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    flexDirection: 'row',
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
                                                  navigation.navigate(ROUTES.SETTINGS_GROUP, {
                                                      screen: ROUTES.SETTINGS,
                                                  })
                                            : undefined
                                    }
                                >
                                    <Animated.View
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
                                paddingVertical: theme.spacing.md,
                                height: COLLAPSED_HEIGHT,
                            }}
                        >
                            <Typography variant={'titleMedium'} fontWeight={'semiBold'} color={'onPrimary'}>
                                SWING ESSENTIALS®
                            </Typography>
                            <Animated.View style={{ opacity: scaleByHeight(1, 0) }}>
                                <Typography color={'onPrimary'} fontWeight={'light'}>{`v${APP_VERSION}`}</Typography>
                            </Animated.View>
                        </Stack>
                    </Stack>
                }
                {...headerProps}
            />
            <TokenModal />
        </>
    );
};
