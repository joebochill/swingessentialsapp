import React from 'react';
import { Alert, ImageSourcePropType } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { Header, wrapIcon } from '@pxblue/react-native-components';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { ROUTES } from '../constants/routes';
import { useSelector, useDispatch } from 'react-redux';
import { requestLogout } from '../redux/actions';
import { HeaderIcon } from '@pxblue/react-native-components/core/header/header';

const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const BackIcon = wrapIcon({ IconClass: Icon, name: 'arrow-back' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: Icon, name: 'person' });

type HeaderProps = NavigationInjectedProps & {
    title: string;
    subtitle?: string;
    expandable?: boolean;
    mainAction?: 'menu' | 'back';
    backgroundImage?: ImageSourcePropType;
    actionItems?: Array<HeaderIcon>
}

export const SEHeader = withNavigation((props: HeaderProps) => {
    const { mainAction='menu', navigation, ...other } = props;
    const token = useSelector(state => state.login.token);
    const dispatch = useDispatch();

    return (
        <Header
            navigation={
                (mainAction === 'menu') ? { icon: MenuIcon, onPress: () => navigation.openDrawer() } :
                (mainAction === 'back') ? { icon: BackIcon, onPress: () => navigation.goBack() } : undefined
            }
            actionItems={[
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
                    : { icon: AccountIcon, onPress: () => props.navigation.navigate(ROUTES.AUTH_GROUP) },
            ]}
            {...other}
        />
    )
})