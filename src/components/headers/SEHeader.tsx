import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Components
import { Alert, Animated } from 'react-native';
import { ResizableHeader } from './ResizableHeader';

// Utilities
import { wrapIcon, HeaderIcon } from '../IconWrapper';

// Icons
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import topology from '../../images/topology_20.png';

// Types
import { ApplicationState, NavType } from '../../__types__';
import { ResizableHeaderProps } from './ResizableHeader';

// Constants
import { ROUTES } from '../../constants/routes';
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Redux
import { requestLogout } from '../../redux/actions';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';

const MenuIcon = wrapIcon({ IconClass: MatIcon, name: 'menu' });
const BackIcon = wrapIcon({ IconClass: MatIcon, name: 'arrow-back' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: MatIcon, name: 'person' });

export type SEHeaderProps = Omit<ResizableHeaderProps, 'headerHeight'> & {
    mainAction?: NavType;
    showAuth?: boolean;
    dynamic?: boolean;
    headerHeight?: Animated.AnimatedInterpolation;
    onNavigate?: Function;
    navigation: any;
};

export const SEHeader = (props: SEHeaderProps) => {
    const {
        mainAction = 'back',
        showAuth = true,
        backgroundImage = topology,
        actionItems = [],
        onNavigate,
        navigation: navigationProp,
        ...other
    } = props;

    const token = useSelector((state: ApplicationState) => state.login.token);
    const dispatch = useDispatch();

    const defaultActions: HeaderIcon[] = showAuth
        ? [
              token
                  ? {
                        icon: LogoutIcon,
                        onPress: () => {
                            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                { text: 'Sign Out', onPress: () => dispatch(requestLogout()) },
                                { text: 'Cancel' },
                            ]);
                        },
                    }
                  : {
                        icon: AccountIcon,
                        onPress: () => navigationProp.navigate({ name: ROUTES.LOGIN, key: ROUTES.LOGIN }),
                    },
          ]
        : [];

    return (
        <ResizableHeader
            navigation={
                mainAction === 'menu'
                    ? {
                          icon: MenuIcon,
                          onPress: () => {
                              navigationProp.openDrawer();
                              if (onNavigate) {
                                  onNavigate();
                              }
                          },
                      }
                    : mainAction === 'back'
                    ? {
                          icon: BackIcon,
                          onPress: () => {
                              navigationProp.pop();
                              if (onNavigate) {
                                  onNavigate();
                              }
                          },
                      }
                    : undefined
            }
            headerHeight={props.headerHeight || HEADER_COLLAPSED_HEIGHT}
            backgroundImage={backgroundImage}
            actionItems={actionItems.concat(defaultActions)}
            {...other}
        />
    );
};
