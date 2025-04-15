import React, { useEffect } from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import topology from '../../images/topology_20.png';
import { NavType } from '../../__types__';
import { ROUTES } from '../../constants/routes';
import { CollapsibleHeader, CollapsibleHeaderProps } from './CollapsibleHeader';
import { IconProps } from '../Icon';
import { COLLAPSED_HEIGHT } from '.';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useLogoutMutation } from '../../redux/apiServices/authService';

export type HeaderProps = CollapsibleHeaderProps & {
    mainAction?: NavType;
    showAuth?: boolean;
    onNavigate?: () => void;
    navigation: any;
    fixed?: boolean;
};

export const Header: React.FC<HeaderProps> = (props) => {
    const {
        mainAction = 'back',
        showAuth = true,
        backgroundImage = topology,
        actionItems = [],
        onNavigate,
        navigation: navigationProp,
        fixed,
        ...other
    } = props;

    const token = useSelector((state: RootState) => state.auth.token);
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
                        onPress: (): void => navigationProp.navigate({ name: ROUTES.LOGIN, key: ROUTES.LOGIN }),
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
                              navigationProp.openDrawer();
                              if (onNavigate) {
                                  onNavigate();
                              }
                          },
                      }
                    : mainAction === 'back'
                    ? {
                          name: 'arrow-back',
                          onPress: (): void => {
                              navigationProp.pop();
                              if (onNavigate) {
                                  onNavigate();
                              }
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
