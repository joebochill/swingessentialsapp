import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, StatusBar } from 'react-native';
import topology from '../../images/topology_20.png';
import { ApplicationState, NavType } from '../../__types__';
import { ROUTES } from '../../constants/routes';
import { requestLogout } from '../../redux/actions';
import { CollapsibleHeader, CollapsibleHeaderProps } from './CollapsibleHeader';
import { IconProps } from '..';
import { COLLAPSED_HEIGHT } from '.';

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

    const token = useSelector((state: ApplicationState) => state.login.token);
    const dispatch = useDispatch();

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
    });

    const defaultActions: IconProps[] = showAuth
        ? [
              token
                  ? {
                        family: 'material-community',
                        name: 'logout-variant',
                        onPress: (): void => {
                            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                {
                                    text: 'Sign Out',
                                    onPress: (): void => {
                                        // @ts-ignore
                                        dispatch(requestLogout());
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
        // <ResizableHeader
        //     // @ts-ignore

        //     headerHeight={props.headerHeight || HEADER_COLLAPSED_HEIGHT}
        //     backgroundImage={backgroundImage}
        //     actionItems={actionItems.concat(defaultActions)}
        //     {...other}
        // />
    );
};
