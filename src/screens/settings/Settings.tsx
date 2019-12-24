import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body, CollapsibleHeaderLayout } from '../../components';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';

// Types
import { NavType, ApplicationState } from '../../__types__';
import { NavigationInjectedProps } from 'react-navigation';
// Redux
import { loadSettings } from '../../redux/actions/SettingsActions';

export const Settings = (props: NavigationInjectedProps) => {
    const settings = useSelector((state: ApplicationState) => state.settings);
    const dispatch = useDispatch();
    let type: NavType = props.navigation.getParam('navType', 'menu');
    const theme = useTheme();

    return (
        <CollapsibleHeaderLayout
            title={'Settings'}
            subtitle={'customize your experience'}
            mainAction={type}
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
                rightTitle={settings.handedness.charAt(0).toUpperCase() + settings.handedness.substr(1)}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
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
                rightTitle={`${settings.duration}s`}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'delay' })}
                title={<Body>Delay</Body>}
                rightTitle={`${settings.delay}s`}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                }}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'overlay' })}
                title={<Body>Overlay</Body>}
                rightTitle={`${settings.overlay ? 'On' : 'Off'}`}
                rightIcon={{
                    name: 'chevron-right',
                    color: theme.colors.text[500],
                }}
            />
        </CollapsibleHeaderLayout>
    );
};
