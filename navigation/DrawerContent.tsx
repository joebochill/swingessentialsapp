import { APP_VERSION, BASE_URL, DRAWER_WIDTH } from '@/_config';
import se from '@/assets/images/logo-small.png';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import {
    COLLAPSED_HEIGHT,
    EXPANDED_HEIGHT,
    useCollapsibleHeader,
} from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Typography } from '@/components/typography/Typography';
import { useAutoLogging } from '@/logger';
import { NavigationItems, Route } from '@/navigation/navigationConfig';
import { useLogoutMutation } from '@/redux/apiServices/authService';
import { BLANK_USER, useGetUserDetailsQuery } from '@/redux/apiServices/userDetailsService';
import { AppDispatch, RootState } from '@/redux/store';
import { initializeData } from '@/redux/thunks';
import { useAppTheme } from '@/theme';
import { lightType, semiBoldType } from '@/theme/fontConfig';
import { useToggleTheme } from '@/theme/ThemeProvider';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { Alert, Animated, AppState, AppStateStatus, Image, Pressable, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    useAutoLogging();
    const theme = useAppTheme();
    const { toggleTheme } = useToggleTheme();

    const router = useRouter();

    const dispatch: AppDispatch = useDispatch();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const [scrollY] = useState(new Animated.Value(0));
    const [activePanel, setActivePanel] = useState(0);
    const [left] = useState({
        main: new Animated.Value(0),
        help: new Animated.Value(0),
    });

    const token = useSelector((state: RootState) => state.auth.token);
    const { data: user = BLANK_USER } = useGetUserDetailsQuery(undefined, {
        skip: !token,
    });

    const [appState, setAppState] = useState(AppState.currentState);

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
        const helpToValue = activePanel === 1 ? -1 * DRAWER_WIDTH : DRAWER_WIDTH;

        Animated.timing(left.main, {
            toValue: mainToValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        Animated.timing(left.help, {
            toValue: helpToValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [activePanel, left.help, left.main]);

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

    const handleDrawerItemPressed = useCallback(
        (item: Route): void => {
            if (item.route) {
                router.push(item.route);
                props.navigation.closeDrawer();
            } else if (item.activatePanel !== undefined) {
                setActivePanel(item.activatePanel);
            } else if (item.onPress) {
                item.onPress();
            }
        },
        [router, props.navigation]
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
                        const leftPosition = ind === 1 ? left.help : left.main;
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
                                                      props.navigation.closeDrawer();
                                                  },
                                              },
                                              { text: 'Cancel' },
                                          ]);
                                      }
                                    : (): void => {
                                          props.navigation.closeDrawer();
                                          router.push({ pathname: '/login' });
                                      },
                            });
                        }
                        return (
                            <Animated.View
                                key={`Panel_${panel.name}`}
                                style={[
                                    {
                                        width: DRAWER_WIDTH,
                                        left: leftPosition,
                                    },
                                ]}
                            >
                                <Stack>
                                    {panelData.map((item, index) => (
                                        <ListItem
                                            key={index}
                                            bottomDivider
                                            title={item.title}
                                            titleEllipsizeMode={'tail'}
                                            left={(): JSX.Element => (
                                                <List.Icon
                                                    icon={({ size, color }): JSX.Element => (
                                                        <Icon name={item.icon} size={size} color={color} />
                                                    )}
                                                />
                                            )}
                                            onPress={() => handleDrawerItemPressed(item)}
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
                                                              <Icon
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
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                mainAction={'none'}
                showAuth={false}
                actionItems={[
                    {
                        name: theme.dark ? 'dark-mode' : 'light-mode',
                        onPress: (): void => toggleTheme(),
                    },
                    token
                        ? {
                              name: 'logout',
                              onPress: (): void => {
                                  Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                      {
                                          text: 'Sign Out',
                                          onPress: (): void => {
                                              logout();
                                          },
                                      },
                                      { text: 'Cancel' },
                                  ]);
                              },
                          }
                        : {
                              name: 'person',
                              onPress: (): void => {
                                  props.navigation.closeDrawer();
                                  router.push('/login');
                              },
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
                                            ? () => {
                                                  props.navigation.closeDrawer();
                                                  router.push('/(drawer)/(screens)/(settings)');
                                              }
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
                                                resizeMode: 'cover',
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
        </>
    );
};
