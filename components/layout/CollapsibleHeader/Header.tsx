import topology from '@/assets/images/topology_20.png';
import { IconProps } from '@/components/common/Icon';
import { CollapsibleHeader, CollapsibleHeaderProps } from '@/components/layout/CollapsibleHeader/CollapsibleHeader';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { useLogoutMutation } from '@/redux/apiServices/authService';
import { RootState } from '@/redux/store';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';

type NavType = 'menu' | 'back' | 'none';

export type HeaderProps = CollapsibleHeaderProps & {
    mainAction?: NavType;
    showAuth?: boolean;
    onNavigate?: () => void;
    fixed?: boolean;
};

export const Header: React.FC<HeaderProps> = (props) => {
    const {
        mainAction = 'back',
        showAuth = true,
        backgroundImage = topology,
        actionItems = [],
        onNavigate,
        fixed,
        ...other
    } = props;

    const token = useSelector((state: RootState) => state.auth.token);
    const router = useRouter();
    const navigation = useNavigation();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }
    });

    const defaultActions: IconProps[] = showAuth
        ? [
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
                            router.push('/login');
                        },
                    },
          ]
        : [];

    return (
        <CollapsibleHeader
            navigationIcon={
                mainAction === 'menu'
                    ? {
                          name: 'menu',
                          onPress: (): void => {
                              navigation.dispatch(DrawerActions.openDrawer());
                              onNavigate?.();
                          },
                      }
                    : mainAction === 'back'
                      ? {
                            name: 'arrow-back',
                            onPress: (): void => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/');
                                }
                                onNavigate?.();
                            },
                        }
                      : undefined
            }
            actionItems={actionItems.concat(defaultActions)}
            backgroundImage={backgroundImage}
            {...other}
            expandedHeight={fixed ? COLLAPSED_HEIGHT : props.expandedHeight}
        />
    );
};
