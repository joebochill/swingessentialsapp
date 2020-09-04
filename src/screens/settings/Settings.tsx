import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body, CollapsibleHeaderLayout } from '../../components';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { sharedStyles } from '../../styles';
import { spaces, sizes } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';

// Types
import { ApplicationState } from '../../__types__';
// Redux
import { loadSettings } from '../../redux/actions/SettingsActions';
import { NavigationStackScreenProps } from 'react-navigation-stack';

export const Settings = (props: NavigationStackScreenProps) => {
    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        if (!token) {
            props.navigation.pop();
        }
    }, [props.navigation, token]);

    return (
        <CollapsibleHeaderLayout
            title={'Settings'}
            subtitle={'Customize your experience'}
            refreshing={settings.loading}
            onRefresh={() => {
                dispatch(loadSettings());
            }}>
            <View style={sharedStyles.sectionHeader}>
                <H7>User Settings</H7>
            </View>
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                topDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'handedness' })}
                title={<Body>Handedness</Body>}
                rightTitle={<Body>{settings.handedness.charAt(0).toUpperCase() + settings.handedness.substr(1)}</Body>}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
            />
            <View style={[sharedStyles.sectionHeader, { marginTop: spaces.large }]}>
                <H7>Camera Settings</H7>
            </View>
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                topDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'duration' })}
                title={<Body>Duration</Body>}
                rightTitle={<Body>{`${settings.duration}s`}</Body>}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'delay' })}
                title={<Body>Delay</Body>}
                rightTitle={<Body>{`${settings.delay}s`}</Body>}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'overlay' })}
                title={<Body>Overlay</Body>}
                rightTitle={<Body>{`${settings.overlay ? 'On' : 'Off'}`}</Body>}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                    size: sizes.small,
                }}
            />
        </CollapsibleHeaderLayout>
    );
};
