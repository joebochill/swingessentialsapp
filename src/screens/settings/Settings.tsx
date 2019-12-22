import * as React from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { wrapIcon, H7, Body } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout } from '../../components';
import { ROUTES } from '../../constants/routes';
import { sharedStyles, spaces } from '../../styles';
import { NavType, ApplicationState } from '../../__types__';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationInjectedProps } from 'react-navigation';
import { loadSettings } from '../../redux/actions/SettingsActions';

// TODO: Determine any additional settings (app-level?)

export const Settings = (props: NavigationInjectedProps) => {
    const settings = useSelector((state: ApplicationState) => state.settings);
    const dispatch = useDispatch();
    let type: NavType = props.navigation.getParam('navType', 'menu');

    return (
        <CollapsibleHeaderLayout 
            title={'Settings'} 
            subtitle={'customize your experience'}
            mainAction={type}
            refreshing={settings.loading}
            onRefresh={() => {
                dispatch(loadSettings());
            }}
        >
            <View style={sharedStyles.sectionHeader}>
                <H7>User Settings</H7>
            </View>
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                topDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.SETTING, {setting: 'handedness'})}
                title={<Body>Handedness</Body>}
                rightTitle={settings.handedness.charAt(0).toUpperCase() + settings.handedness.substr(1)}
            />
            <View style={[sharedStyles.sectionHeader, {marginTop: spaces.large}]}>
                <H7>Camera Settings</H7>
            </View>
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                topDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.SETTING, {setting: 'duration'})}
                title={<Body>Duration</Body>}
                rightTitle={`${settings.duration}s`}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.SETTING, {setting: 'delay'})}
                title={<Body>Delay</Body>}
                rightTitle={`${settings.delay}s`}
            />
            <ListItem
                containerStyle={sharedStyles.listItem}
                contentContainerStyle={sharedStyles.listItemContent}
                bottomDivider
                chevron={true}
                onPress={() => props.navigation.navigate(ROUTES.SETTING, {setting: 'overlay'})}
                title={<Body>Overlay</Body>}
                rightTitle={`${settings.overlay ? 'On' : 'Off'}`}
            />
        </CollapsibleHeaderLayout>

    );
};