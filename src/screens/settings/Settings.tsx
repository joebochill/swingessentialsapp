import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { Body, CollapsibleHeaderLayout } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
import { useTheme, List, Subheading, Divider } from 'react-native-paper';

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
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);

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
            <View style={[sharedStyles.sectionHeader]}>
                <Subheading style={listStyles.heading}>{'User Settings'}</Subheading>
            </View>
            <>
                <Divider />
                <List.Item
                    title={'Handedness'}
                    titleEllipsizeMode={'tail'}
                    onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'handedness' })}
                    style={listStyles.item}
                    titleStyle={{ marginLeft: -8 }}
                    descriptionStyle={{ marginLeft: -8 }}
                    right={({ style, ...rightProps }) => (
                        <View style={[flexStyles.row, style]} {...rightProps}>
                            <Body>{settings.handedness.charAt(0).toUpperCase() + settings.handedness.substr(1)}</Body>
                            <MatIcon
                                name={'chevron-right'}
                                size={theme.sizes.small}
                                style={{ marginLeft: theme.spaces.small, marginRight: -1 * theme.spaces.small }}
                            />
                        </View>
                    )}
                />
                <Divider />
            </>
            <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo }]}>
                <Subheading style={listStyles.heading}>{'Camera Settings'}</Subheading>
            </View>
            <>
                <Divider />
                <List.Item
                    title={'Recording Duration'}
                    titleEllipsizeMode={'tail'}
                    onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'duration' })}
                    style={listStyles.item}
                    titleStyle={{ marginLeft: -8 }}
                    descriptionStyle={{ marginLeft: -8 }}
                    right={({ style, ...rightProps }) => (
                        <View style={[flexStyles.row, style]} {...rightProps}>
                            <Body>{`${settings.duration}s`}</Body>
                            <MatIcon
                                name={'chevron-right'}
                                size={theme.sizes.small}
                                style={{ marginLeft: theme.spaces.small, marginRight: -1 * theme.spaces.small }}
                            />
                        </View>
                    )}
                />
                <Divider />
                <List.Item
                    title={'Recording Delay'}
                    titleEllipsizeMode={'tail'}
                    onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'delay' })}
                    style={listStyles.item}
                    titleStyle={{ marginLeft: -8 }}
                    descriptionStyle={{ marginLeft: -8 }}
                    right={({ style, ...rightProps }) => (
                        <View style={[flexStyles.row, style]} {...rightProps}>
                            <Body>{`${settings.delay}s`}</Body>
                            <MatIcon
                                name={'chevron-right'}
                                size={theme.sizes.small}
                                style={{ marginLeft: theme.spaces.small, marginRight: -1 * theme.spaces.small }}
                            />
                        </View>
                    )}
                />
                <Divider />
                <List.Item
                    title={'Stance Overlay'}
                    titleEllipsizeMode={'tail'}
                    onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'overlay' })}
                    style={listStyles.item}
                    titleStyle={{ marginLeft: -8 }}
                    descriptionStyle={{ marginLeft: -8 }}
                    right={({ style, ...rightProps }) => (
                        <View style={[flexStyles.row, style]} {...rightProps}>
                            <Body>{`${settings.overlay ? 'On' : 'Off'}`}</Body>
                            <MatIcon
                                name={'chevron-right'}
                                size={theme.sizes.small}
                                style={{ marginLeft: theme.spaces.small, marginRight: -1 * theme.spaces.small }}
                            />
                        </View>
                    )}
                />
                <Divider />
            </>
        </CollapsibleHeaderLayout>
    );
};
