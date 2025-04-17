import React, { useState, useCallback, useEffect, JSX } from 'react';
import { Animated, AppState, AppStateStatus, Image, Alert, ScrollView, Pressable } from 'react-native';
import { NavigationItems } from './navigationConfig';
import MatIcon from '@react-native-vector-icons/material-icons';
import { APP_VERSION, BASE_URL, DRAWER_WIDTH } from '../constants';
import { ROUTES } from '../constants/routes';
import { List } from 'react-native-paper';
import se from '../images/logo-small.png';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppTheme } from '../theme';
import { lightType, semiBoldType } from '../theme/typography/fontConfig';
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT, Header, useCollapsibleHeader } from '../components/CollapsibleHeader';
import { Stack } from '../components/layout/Stack';
import { ListItem } from '../components/ListItem';
import { Typography } from '../components/typography';
import { BLANK_USER, useGetUserDetailsQuery } from '../redux/apiServices/userDetailsService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { initializeData } from '../redux/thunks';
import { AppDispatch } from '../redux/store';
import { useLogoutMutation } from '../redux/apiServices/authService';
import { MaterialIconName } from '../components/Icon';
import { TokenModal } from '../components/feedback';
import { useToggleTheme } from '../theme/ThemeProvider';
import { format } from 'date-fns';

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const theme = useAppTheme();
    const { toggleTheme } = useToggleTheme();

    const dispatch: AppDispatch = useDispatch();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const [scrollY] = useState(new Animated.Value(0));
    const [activePanel, setActivePanel] = useState(0);
    const [left] = useState({
        main: new Animated.Value(0),
        account: new Animated.Value(0),
        help: new Animated.Value(-1 * DRAWER_WIDTH),
    });

    const token = useSelector((state: RootState) => state.auth.token);
    const { data: user = BLANK_USER } = useGetUserDetailsQuery(undefined, { skip: !token });

    const [appState, setAppState] = useState(AppState.currentState);

    const { navigation } = props;
    const [logout] = useLogoutMutation();

    const userString = token && user.username ? user.username : 'Welcome!';
    const nameString = user?.first && user?.last ? `${user.first} ${user.last}` : 'New User';
    const memberString = `Joined ${
        user.joined ? format(new Date(user.joined * 1000), 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')
    }`;
    const avatarURL = `${BASE_URL}/images/profiles/${
        user?.avatar ? `${user.username}/${user.avatar}.png` : 'blank.png'
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
                dispatch(initializeData());
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
                    scrollProps.onScroll?.(e);
                }}
                style={{ backgroundColor: theme.colors.surface }}
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
                                                      logout();
                                                      navigation.closeDrawer();
                                                  },
                                              },
                                              { text: 'Cancel' },
                                          ]);
                                      }
                                    : (): void => navigation.navigate('APP', { screen: ROUTES.LOGIN }),
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
                                                        <MatIcon
                                                            name={item.icon as MaterialIconName}
                                                            size={size}
                                                            color={color}
                                                        />
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
                                                              navigation.navigate('APP', {
                                                                  screen: item.route as string,
                                                                  params: {
                                                                      screen: item.screen,
                                                                  },
                                                              });
                                                          }
                                                        : (): void => {
                                                              navigation.navigate('APP', {
                                                                  screen: item.route as string,
                                                              });
                                                          }
                                                    : item.activatePanel !== undefined
                                                    ? (): void => {
                                                          setActivePanel(item.activatePanel as number);
                                                      }
                                                    : item.onPress
                                                    ? (): void => item.onPress?.()
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
                                                                  color={theme.colors.onPrimaryContainer}
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
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                mainAction={'none'}
                actionItems={[
                    {
                        name: theme.dark ? 'dark-mode' : 'light-mode',
                        onPress: (): void => toggleTheme(),
                    },
                ]}
                content={
                    <Stack
                        justify={'flex-end'}
                        style={{
                            flex: 1,
                            marginRight: -2 * theme.size.md - 3 * theme.spacing.sm - theme.spacing.xs,
                        }}
                    >
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
                                <Pressable
                                    android_ripple={{ color: 'transparent' }}
                                    onPress={
                                        token
                                            ? (): void =>
                                                  navigation.navigate('APP', {
                                                      screen: ROUTES.SETTINGS_GROUP,
                                                      params: {
                                                          screen: ROUTES.SETTINGS,
                                                      },
                                                  })
                                            : undefined
                                    }
                                >
                                    <Animated.View
                                        style={[
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: theme.dark
                                                    ? theme.colors.primary
                                                    : theme.colors.primaryContainer,
                                                height: scaleByHeight(80, 0),
                                                width: scaleByHeight(80, 0),
                                                borderRadius: scaleByHeight(80 / 2, 0),
                                                overflow: 'hidden',
                                            },
                                        ]}
                                    >
                                        <Image
                                            resizeMethod="resize"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resizeMode: 'contain',
                                            }}
                                            source={user?.avatar ? { uri: avatarURL } : se}
                                        />
                                    </Animated.View>
                                </Pressable>
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
