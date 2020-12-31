import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

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
};

export const SEHeader = (props: SEHeaderProps) => {
    const {
        mainAction = 'back',
        showAuth = true,
        backgroundImage = topology,
        actionItems = [],
        onNavigate,
        ...other
    } = props;
    const navigation = useNavigation();
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
                        onPress: () => navigation.navigate({ name: ROUTES.LOGIN, key: ROUTES.LOGIN }),
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
                              navigation.openDrawer();
                              if (onNavigate) {
                                  onNavigate();
                              }
                          },
                      }
                    : mainAction === 'back'
                    ? {
                          icon: BackIcon,
                          onPress: () => {
                              navigation.pop();
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
