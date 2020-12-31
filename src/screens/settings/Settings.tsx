import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, Image, RefreshControl, ScrollView, TouchableHighlight } from 'react-native';
import { Body, SEButton, SEHeader } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles, useFormStyles } from '../../styles';
import { useTheme, List, Subheading, Divider, TextInput, IconButton } from 'react-native-paper';

// Types
import { ApplicationState } from '../../__types__';
// Redux
import { loadSettings } from '../../redux/actions/SettingsActions';
import { StackScreenProps } from '@react-navigation/stack';
import { getLongDate } from '../../utilities';
import { transparent } from '../../styles/colors';
import { setUserData, loadUserInfo, setUserAvatar } from '../../redux/actions/user-data-actions';
import { width, height } from '../../utilities/dimensions';
import { HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { RootStackParamList } from '../../navigation/MainNavigator';

const objectsEqual = (a: Object, b: Object) => {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};

export const Settings = (props: StackScreenProps<RootStackParamList, 'Settings'>) => {
    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const userData = useSelector((state: ApplicationState) => state.userData);
    const role = useSelector((state: ApplicationState) => state.login.role);

    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const formStyles = useFormStyles(theme);

    const [editAbout, setEditAbout] = useState(false);
    const [activeField, setActiveField] = useState<'first' | 'last' | 'location' | 'phone' | null>(null);
    const [personal, setPersonal] = useState(userData);

    const memberString = `Joined ${userData.joined ? getLongDate(userData.joined * 1000) : getLongDate(Date.now())}`;
    const avatarURL = `https://www.swingessentials.com/images/profiles/${
        settings.avatar ? `${userData.username}/${settings.avatar}.png` : 'blank.png'
    }`;

    useEffect(() => {
        if (!token) {
            props.navigation.pop();
        }
    }, [props.navigation, token]);

    useEffect(() => {
        setPersonal(userData);
    }, [userData, setPersonal]);

    return (
        <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
            <SEHeader title={userData.username} subtitle={memberString} mainAction={'back'} />
            <ScrollView
                contentContainerStyle={[
                    flexStyles.paddingMedium,
                    { paddingHorizontal: 0, paddingBottom: height * 0.5 },
                ]}
                keyboardShouldPersistTaps={'always'}
                refreshControl={
                    <RefreshControl
                        refreshing={settings.loading}
                        onRefresh={() => {
                            dispatch(loadSettings());
                            dispatch(loadUserInfo());
                        }}
                        progressViewOffset={HEADER_EXPANDED_HEIGHT}
                    />
                }
            >
                <View style={{ alignSelf: 'center' }}>
                    <TouchableHighlight
                        underlayColor={theme.colors.onPrimary}
                        onPress={() => {
                            ImagePicker.openPicker({
                                width: 200,
                                height: 200,
                                cropping: true,
                                cropperCircleOverlay: true,
                                includeBase64: true,
                            })
                                .then((image) => {
                                    dispatch(
                                        setUserAvatar({
                                            useAvatar: 1,
                                            avatar: image.data,
                                        })
                                    );
                                })
                                .catch((err) => {
                                    // do nothing (canceled image picker)
                                });
                        }}
                        style={{
                            width: width / 2,
                            height: width / 2,
                            maxWidth: 200,
                            maxHeight: 200,
                            alignSelf: 'center',
                            borderRadius: width / 4,
                            overflow: 'hidden',
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <>
                            <Image source={{ uri: avatarURL }} style={{ width: '100%', height: '100%' }} />
                            <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' }}>
                                <IconButton
                                    icon="pencil"
                                    color={theme.colors.onPrimary}
                                    size={theme.sizes.small}
                                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                />
                            </View>
                        </>
                    </TouchableHighlight>
                    {settings.avatar !== '' && (
                        <IconButton
                            icon="close"
                            color={theme.colors.onPrimary}
                            size={theme.sizes.xSmall}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                            }}
                            onPress={() => {
                                dispatch(
                                    setUserAvatar({
                                        useAvatar: 0,
                                        avatar: '',
                                    })
                                );
                            }}
                        />
                    )}
                </View>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.large }]}>
                    <Subheading style={listStyles.heading}>{'About Me'}</Subheading>
                    <SEButton
                        mode={'outlined'}
                        title={editAbout ? 'Cancel' : 'Edit'}
                        onPress={() => {
                            setEditAbout(!editAbout);
                            setPersonal(userData);
                        }}
                    />
                </View>
                {/* Read Mode */}
                {!editAbout && (
                    <>
                        <Divider />
                        <List.Item
                            title={'First Name'}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{userData.firstName}</Body>
                                </View>
                            )}
                        />
                        <Divider />
                        <List.Item
                            title={'Last Name'}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{userData.lastName}</Body>
                                </View>
                            )}
                        />
                        <Divider />
                        <List.Item
                            title={'Location'}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{userData.location}</Body>
                                </View>
                            )}
                        />
                        <Divider />
                        <List.Item
                            title={'Phone Number'}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{userData.phone}</Body>
                                </View>
                            )}
                        />
                        <Divider />
                        <List.Item
                            title={`Email Address`}
                            description={role === 'pending' ? 'unverified' : undefined}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{userData.email}</Body>
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                {/* Write Mode */}
                {editAbout && (
                    <View style={flexStyles.paddingHorizontal}>
                        <Divider />
                        <TextInput
                            label={'First Name'}
                            value={personal.firstName}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={[
                                activeField === 'first' || personal.firstName.length > 0
                                    ? formStyles.active
                                    : formStyles.inactive,
                            ]}
                            onFocus={() => setActiveField('first')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(value: string) => setPersonal({ ...personal, firstName: value })}
                            underlineColorAndroid={transparent}
                        />
                        <Divider />
                        <TextInput
                            label={'Last Name'}
                            value={personal.lastName}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={[
                                formStyles.formField,
                                activeField === 'last' || personal.lastName.length > 0
                                    ? formStyles.active
                                    : formStyles.inactive,
                            ]}
                            onFocus={() => setActiveField('last')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(value: string) => setPersonal({ ...personal, lastName: value })}
                            underlineColorAndroid={transparent}
                        />
                        <Divider />
                        <TextInput
                            label={'Location'}
                            value={personal.location}
                            placeholder={'e.g., Denver, CO'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={[
                                formStyles.formField,
                                activeField === 'location' || (personal.location || '').length > 0
                                    ? formStyles.active
                                    : formStyles.inactive,
                            ]}
                            onFocus={() => setActiveField('location')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(value: string) => setPersonal({ ...personal, location: value })}
                            underlineColorAndroid={transparent}
                        />
                        <Divider />
                        <TextInput
                            label={'Phone Number'}
                            value={personal.phone}
                            placeholder={'e.g., 123-456-7890'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={[
                                formStyles.formField,
                                activeField === 'phone' || (personal.phone || '').length > 0
                                    ? formStyles.active
                                    : formStyles.inactive,
                            ]}
                            onFocus={() => setActiveField('phone')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(value: string) => setPersonal({ ...personal, phone: value })}
                            underlineColorAndroid={transparent}
                        />
                        <Divider />
                        <TextInput
                            editable={false}
                            label={'Email Address'}
                            value={personal.email}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={[formStyles.formField, formStyles.active, { opacity: 0.6 }]}
                            underlineColorAndroid={transparent}
                        />
                        <Divider />
                        {!objectsEqual(personal, userData) && (
                            <SEButton
                                style={formStyles.formField}
                                title={'Save Changes'}
                                onPress={() => {
                                    /* TODO Save the settings */
                                    dispatch(setUserData(personal));
                                    setEditAbout(false);
                                }}
                            />
                        )}
                    </View>
                )}

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo }]}>
                    <Subheading style={listStyles.heading}>{'User Settings'}</Subheading>
                </View>
                <>
                    <Divider />
                    <List.Item
                        title={'Swing Handedness'}
                        titleEllipsizeMode={'tail'}
                        onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'handedness' })}
                        style={listStyles.item}
                        titleStyle={{ marginLeft: -8 }}
                        descriptionStyle={{ marginLeft: -8 }}
                        right={({ style, ...rightProps }) => (
                            <View style={[flexStyles.row, style]} {...rightProps}>
                                <Body>
                                    {settings.handedness.charAt(0).toUpperCase() + settings.handedness.substr(1)}
                                </Body>
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
                    <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo }]}>
                        <Subheading style={listStyles.heading}>{'Notifications'}</Subheading>
                    </View>
                    <>
                        <Divider />
                        <List.Item
                            title={'New Lesson Emails'}
                            titleEllipsizeMode={'tail'}
                            onPress={() => props.navigation.navigate(ROUTES.SETTING, { setting: 'notifications' })}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{`${settings.notifications ? 'On' : 'Off'}`}</Body>
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
                </>
            </ScrollView>
        </View>
    );
};
