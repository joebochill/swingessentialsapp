import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, Image, RefreshControl, ScrollView, TouchableHighlight, Keyboard } from 'react-native';
import { Typography, SEButton, SEHeader, Stack, SectionHeader, ListItem } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles, useFormStyles } from '../../styles';
import { useTheme, List, Subheading, Divider, TextInput, IconButton } from 'react-native-paper';

// Types
import { ApplicationState, Average } from '../../__types__';
// Redux
import { loadSettings } from '../../redux/actions/SettingsActions';
import { StackScreenProps } from '@react-navigation/stack';
import { getLongDate } from '../../utilities';
import { blackOpacity } from '../../styles/colors';
import { setUserData, loadUserInfo, setUserAvatar } from '../../redux/actions/user-data-actions';
import { width, height } from '../../utilities/dimensions';
import { HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { RootStackParamList } from '../../navigation/MainNavigator';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { useAppTheme } from '../../styles/theme';

const objectsEqual = (a: Record<string, unknown>, b: Record<string, unknown>): boolean => {
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

const mapAverageToLabel = (avg: Average | undefined): string => {
    switch (parseInt(avg || '', 10)) {
        case 60:
            return 'Under 70';
        case 70:
            return '70-79';
        case 80:
            return '80-89';
        case 90:
            return '90-99';
        case 100:
            return '100-149';
        case 150:
            return '150+';
        default:
            return '--';
    }
};

export const Settings: React.FC<StackScreenProps<RootStackParamList, 'Settings'>> = (props) => {
    const settings = useSelector((state: ApplicationState) => state.settings);
    const { lessons, marketing, newsletter, reminders } = settings.notifications || {
        lessons: true,
        marketing: true,
        newsletter: true,
        reminders: true,
    };
    const token = useSelector((state: ApplicationState) => state.login.token);
    const userData = useSelector((state: ApplicationState) => state.userData);
    const role = useSelector((state: ApplicationState) => state.login.role);

    const dispatch = useDispatch();
    const theme = useAppTheme();
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const formStyles = useFormStyles(theme);

    const [editAbout, setEditAbout] = useState(false);
    const [activeField, setActiveField] = useState<
        'first' | 'last' | 'location' | 'birthday' | 'average' | 'goals' | null
    >(null);
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
        <Stack
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingTop: HEADER_COLLAPSED_HEIGHT,
                },
            ]}
        >
            {/* @ts-ignore */}
            <SEHeader
                title={userData.username}
                subtitle={memberString}
                mainAction={'back'}
                navigation={props.navigation}
            />
            <ScrollView
                contentContainerStyle={[
                    {
                        paddingHorizontal: theme.spacing.md,
                        paddingTop: theme.spacing.md,
                        paddingBottom: height * 0.5,
                    },
                ]}
                keyboardShouldPersistTaps={'always'}
                refreshControl={
                    <RefreshControl
                        refreshing={settings.loading}
                        onRefresh={(): void => {
                            // @ts-ignore
                            dispatch(loadSettings());
                            // @ts-ignore
                            dispatch(loadUserInfo());
                        }}
                        progressViewOffset={HEADER_EXPANDED_HEIGHT}
                    />
                }
            >
                {/* AVATAR SECTION */}
                <View style={{ alignSelf: 'center' }}>
                    <TouchableHighlight
                        underlayColor={theme.colors.onPrimary}
                        onPress={(): void => {
                            ImagePicker.openPicker({
                                width: 200,
                                height: 200,
                                cropping: true,
                                cropperCircleOverlay: true,
                                includeBase64: true,
                            })
                                .then((image) => {
                                    dispatch(
                                        // @ts-ignore
                                        setUserAvatar({
                                            useAvatar: 1,
                                            // @ts-ignore
                                            avatar: image.data,
                                        })
                                    );
                                })
                                .catch((/*err*/): void => {
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
                            backgroundColor: theme.colors.primaryContainer,
                        }}
                    >
                        <>
                            <Image source={{ uri: avatarURL }} style={{ width: '100%', height: '100%' }} />
                            <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' }}>
                                <IconButton
                                    mode={'contained'}
                                    icon="pencil"
                                    iconColor={theme.colors.onPrimary}
                                    containerColor={'rgba(0,0,0,0.5)'}
                                />
                            </View>
                        </>
                    </TouchableHighlight>
                    {settings.avatar !== '' && (
                        <IconButton
                            icon="close"
                            mode={'contained'}
                            iconColor={theme.colors.onPrimary}
                            containerColor={'rgba(0,0,0,0.5)'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                            }}
                            onPress={(): void => {
                                dispatch(
                                    // @ts-ignore
                                    setUserAvatar({
                                        useAvatar: 0,
                                        avatar: '',
                                    })
                                );
                            }}
                        />
                    )}
                </View>

                {/* SETTINGS SECTION */}
                <SectionHeader
                    title={'About Me'}
                    action={
                        <SEButton
                            mode={'outlined'}
                            title={editAbout ? 'Cancel' : 'Edit'}
                            onPress={(): void => {
                                setEditAbout(!editAbout);
                                setPersonal(userData);
                            }}
                        />
                    }
                />

                {/* Read Mode */}
                {!editAbout && (
                    <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                        <Divider />
                        <ListItem
                            title={'First Name'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{userData.firstName}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={'Last Name'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{userData.lastName}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={'Location'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{userData.location}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={'Date of Birth'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{userData.birthday || '--'}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={`Email Address`}
                            description={role === 'pending' ? 'unverified' : undefined}
                            titleEllipsizeMode={'tail'}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{userData.email}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={'Avg. Score (18 Holes)'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{mapAverageToLabel(userData.average)}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        <ListItem
                            title={'Golf Goals'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{`${(userData.goals || '').substr(0, 18)}...`}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider />
                        {/* < ListItem
                            title={'Phone Number'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack direction={'row'} align={'center'} style={[style, {marginRight: 0}]} {...rightProps}>
                                    <Typography>{userData.phone}</Typography>
                                </Stack>
                            )}
                        />
                        <Divider /> */}
                    </Stack>
                )}
                {/* Write Mode */}
                {editAbout && (
                    <Stack space={theme.spacing.sm}>
                        <TextInput
                            label={'First Name'}
                            value={personal.firstName}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onFocus={(): void => setActiveField('first')}
                            onBlur={(): void => setActiveField(null)}
                            onChangeText={(value: string): void => setPersonal({ ...personal, firstName: value })}
                            underlineColorAndroid={'transparent'}
                        />
                        <TextInput
                            label={'Last Name'}
                            value={personal.lastName}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onFocus={(): void => setActiveField('last')}
                            onBlur={(): void => setActiveField(null)}
                            onChangeText={(value: string): void => setPersonal({ ...personal, lastName: value })}
                            underlineColorAndroid={'transparent'}
                        />
                        <TextInput
                            label={'Location'}
                            value={personal.location}
                            placeholder={'e.g., Denver, CO'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onFocus={(): void => setActiveField('location')}
                            onBlur={(): void => setActiveField(null)}
                            onChangeText={(value: string): void => setPersonal({ ...personal, location: value })}
                            underlineColorAndroid={'transparent'}
                        />
                        {/* 
                                <TextInput
                                    label={'Phone Number'}
                                    value={personal.phone}
                                    placeholder={'e.g., 123-456-7890'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    onFocus={(): void => setActiveField('phone')}
                                    onBlur={(): void => setActiveField(null)}
                                    onChangeText={(value: string): void => setPersonal({ ...personal, phone: value })}
                                    underlineColorAndroid={'transparent'}
                                />
                                <Divider /> 
                            */}
                        <Stack>
                            <TextInput
                                label={'Date of Birth'}
                                value={personal.birthday}
                                placeholder={'MM/DD/YYYY'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onFocus={(): void => {
                                    setActiveField('birthday');
                                    Keyboard.dismiss();
                                }}
                                underlineColorAndroid={'transparent'}
                            />
                            {/* TODO: Fix the date picker */}
                            <DateTimePicker
                                date={new Date(personal.birthday || Date.now())}
                                isVisible={activeField === 'birthday'}
                                onConfirm={(date): void => {
                                    setPersonal({ ...personal, birthday: format(new Date(date), 'MM/dd/yyyy') });
                                    setActiveField(null);
                                }}
                                onCancel={(): void => setActiveField(null)}
                            />
                        </Stack>
                        <TextInput
                            editable={false}
                            label={'Email Address'}
                            value={personal.email}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            disabled
                            underlineColorAndroid={'transparent'}
                        />
                        <RNPickerSelect
                            placeholder={{ label: 'Choose One...', value: '', color: theme.colors.primary }}
                            items={[
                                { label: 'Under 70', value: '60' },
                                { label: '70-79', value: '70' },
                                { label: '80-89', value: '80' },
                                { label: '90-99', value: '90' },
                                { label: '100-149', value: '100' },
                                { label: '150+', value: '150' },
                            ]}
                            onOpen={(): void => setActiveField('average')}
                            onClose={(): void => setActiveField(null)}
                            onValueChange={(value: string): void => {
                                setPersonal({ ...personal, average: value as Average });
                            }}
                            value={personal.average}
                            useNativeAndroidPickerStyle={false}
                        >
                            <TextInput
                                editable={false}
                                label={'Avg. Score (18 Holes)'}
                                underlineColorAndroid={'transparent'}
                                value={mapAverageToLabel(personal.average)}
                            />
                        </RNPickerSelect>

                        <TextInput
                            label={'Golf Goals'}
                            multiline
                            value={personal.goals}
                            placeholder={'I want to be the next Tiger Woods...'}
                            autoCorrect={false}
                            autoCapitalize={'sentences'}
                            blurOnSubmit={true}
                            maxLength={255}
                            returnKeyType={'done'}
                            spellCheck
                            textAlignVertical={'top'}
                            onFocus={(): void => setActiveField('goals')}
                            onBlur={(): void => setActiveField(null)}
                            onChangeText={(value: string): void => setPersonal({ ...personal, goals: value })}
                            underlineColorAndroid={'transparent'}
                        />
                        <Typography style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}>{`${
                            255 - (personal.goals || '').length
                        } Characters Left`}</Typography>
                        {!objectsEqual(personal, userData) && (
                            <SEButton
                                title={'Save Changes'}
                                onPress={(): void => {
                                    /* TODO Save the settings */
                                    // @ts-ignore
                                    dispatch(setUserData(personal));
                                    setEditAbout(false);
                                }}
                            />
                        )}
                    </Stack>
                )}

                <SectionHeader title={'User Settings'} style={{ marginTop: theme.spacing.xl }} />
                <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                    <Divider />
                    <ListItem
                        title={'Swing Handedness'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'handedness' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>
                                    {settings.handedness.charAt(0).toUpperCase() + settings.handedness.substring(1)}
                                </Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                </Stack>

                <SectionHeader title={'Camera Settings'} style={{ marginTop: theme.spacing.xl }} />
                <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                    <Divider />
                    <ListItem
                        title={'Recording Duration'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'duration' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${settings.duration}s`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                    <ListItem
                        title={'Recording Delay'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'delay' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${settings.delay}s`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                    <ListItem
                        title={'Stance Overlay'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'overlay' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${settings.overlay ? 'On' : 'Off'}`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                </Stack>

                <SectionHeader title={'Email Notifications'} style={{ marginTop: theme.spacing.xl }} />
                <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                    <Divider />
                    <ListItem
                        title={'Lessons'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'lessons' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${lessons ? 'On' : 'Off'}`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                    <ListItem
                        title={'Marketing'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'marketing' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${marketing ? 'On' : 'Off'}`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                    <ListItem
                        title={'Newsletters'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'newsletter' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${newsletter ? 'On' : 'Off'}`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                    <ListItem
                        title={'Reminders'}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.SETTING, { setting: 'reminders' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${reminders ? 'On' : 'Off'}`}</Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <Divider />
                </Stack>
            </ScrollView>
        </Stack>
    );
};
