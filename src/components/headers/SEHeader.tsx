import React from 'react';
import { Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { Header, wrapIcon } from '@pxblue/react-native-components';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { PXBHeader } from './PXBHeader';
import { ApplicationState, NavType } from '../../__types__';

import { ROUTES } from '../../constants/routes';
import { useSelector, useDispatch } from 'react-redux';
import { requestLogout } from '../../redux/actions';
import { HeaderIcon, HeaderProps } from '@pxblue/react-native-components/core/header/header';

import topology from '../../images/topology_20.png';

const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const BackIcon = wrapIcon({ IconClass: Icon, name: 'arrow-back' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: Icon, name: 'person' });

export type SEHeaderProps = HeaderProps &
    NavigationInjectedProps & {
        mainAction?: NavType;
        showAuth?: boolean;
        dynamic?: boolean;
        onNavigate?: Function;
    };

export const SEHeader = withNavigation((props: SEHeaderProps) => {
    const {
        mainAction = 'menu',
        showAuth = true,
        navigation,
        backgroundImage = topology,
        actionItems = [],
        onNavigate,
        ...other
    } = props;
    const token = useSelector((state: ApplicationState) => state.login.token);
    const dispatch = useDispatch();

    const defaultActions: Array<HeaderIcon> = showAuth
        ? [
              token
                  ? {
                        icon: LogoutIcon,
                        onPress: () => {
                            Alert.alert('Log Out', 'Are you sure you want to log out?', [
                                { text: 'Log Out', onPress: () => dispatch(requestLogout(token)) },
                                { text: 'Cancel' },
                            ]);
                        },
                    }
                  : {
                        icon: AccountIcon,
                        onPress: () =>
                            props.navigation.navigate({ routeName: ROUTES.AUTH_GROUP, key: ROUTES.AUTH_GROUP }),
                    },
          ]
        : [];

    const Component = props.dynamic ? PXBHeader : Header;

    return (
        <Component
            navigation={
                mainAction === 'menu'
                    ? { icon: MenuIcon, onPress: () => {
                        navigation.openDrawer();
                        if(onNavigate) onNavigate();
                    }}
                    : mainAction === 'back'
                    ? { icon: BackIcon, onPress: () => {
                        navigation.pop();
                        if(onNavigate) onNavigate();
                    }}
                    : undefined
            }
            backgroundImage={backgroundImage}
            actionItems={defaultActions.concat(actionItems)}
            {...other}
        />
    );
});
