import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

// Components
import { Alert, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { ResizableHeader } from './ResizableHeader';

// Utilities
import { wrapIcon, HeaderIcon } from '../IconWrapper';

// Icons
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import topology from '../../images/topology_20.png';

// Types
import { ApplicationState, NavType } from '../../__types__';
import { ResizableHeaderProps } from './ResizableHeader';

// Constants
import { ROUTES } from '../../constants/routes';
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

// Redux
import { requestLogout } from '../../redux/actions';

const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const BackIcon = wrapIcon({ IconClass: Icon, name: 'arrow-back' });
const LogoutIcon = wrapIcon({ IconClass: MaterialCommunity, name: 'logout-variant' });
const AccountIcon = wrapIcon({ IconClass: Icon, name: 'person' });

export type SEHeaderProps = Omit<ResizableHeaderProps, 'headerHeight'> & {
    mainAction?: NavType;
    showAuth?: boolean;
    dynamic?: boolean;
    headerHeight?: Animated.AnimatedInterpolation;
    onNavigate?: Function;
};

export const SEHeader = withNavigation((props: SEHeaderProps & NavigationInjectedProps) => {
    const {
        mainAction = 'back',
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
            actionItems={defaultActions.concat(actionItems)}
            {...other}
        />
    );
});
