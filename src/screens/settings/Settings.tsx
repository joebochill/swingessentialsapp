import React, { JSX, useEffect, useState } from 'react';
import { View, Image as RNImage, RefreshControl, ScrollView, TouchableHighlight, Keyboard } from 'react-native';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';
import { IconButton } from 'react-native-paper';
import { width, height } from '../../utilities/dimensions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { format, parse } from 'date-fns';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    BLANK_USER,
    Level3UserDetailsApiResponse,
    ScoreRange,
    useGetUserDetailsQuery,
    useUpdateUserDetailsMutation,
} from '../../redux/apiServices/userDetailsService';
import { useNavigation } from '@react-navigation/core';
import { SettingsStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { SEButton } from '../../components/SEButton';
import { ListItem } from '../../components/ListItem';
import { Typography } from '../../components/typography';
import { StyledTextInput } from '../../components/inputs/StyledTextInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Icon } from '../../components/Icon';
import { ROUTES } from '../../constants/routes';
import { BASE_URL } from '../../constants';

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

const mapAverageToLabel = (avg: ScoreRange | undefined): string => {
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

export const Settings: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: user = BLANK_USER, isFetching, refetch } = useGetUserDetailsQuery();
    const [updateUserDetails] = useUpdateUserDetailsMutation();
    const {
        notify_new_lesson: lessons,
        notify_marketing: marketing,
        notify_newsletter: newsletter,
        notify_reminders: reminders,
    } = user;

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const [editAbout, setEditAbout] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [personal, setPersonal] = useState(user);

    const memberString = `Joined ${
        user.joined ? format(new Date(user.joined * 1000), 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')
    }`;
    const avatarURL = `${BASE_URL}/images/profiles/${
        user.avatar ? `${user.username}/${user.avatar}.png` : 'blank.png'
    }`;

    useEffect(() => {
        if (!token) {
            navigation.pop();
        }
    }, [navigation, token]);

    useEffect(() => {
        setPersonal(user);
    }, [user, setPersonal]);

    return (
        <Stack
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingTop: COLLAPSED_HEIGHT + insets.top,
                },
            ]}
        >
            <Header
                title={user.username}
                subtitle={memberString}
                mainAction={'back'}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                navigation={navigation}
                fixed
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
                        refreshing={isFetching}
                        onRefresh={(): void => {
                            refetch();
                        }}
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
                                    if (image) {
                                        updateUserDetails({
                                            avatar: (image as Image).data ?? '',
                                        });
                                    }
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
                            backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                        }}
                    >
                        <View>
                            <RNImage source={{ uri: avatarURL }} style={{ width: '100%', height: '100%' }} />
                            <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' }}>
                                <IconButton
                                    mode={'contained'}
                                    icon="edit"
                                    iconColor={theme.colors.onPrimary}
                                    containerColor={'rgba(0,0,0,0.5)'}
                                />
                            </View>
                        </View>
                    </TouchableHighlight>
                    {user.avatar !== '' && (
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
                                updateUserDetails({
                                    avatar: '',
                                });
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
                                setPersonal(user);
                            }}
                        />
                    }
                />

                {/* Read Mode */}
                {!editAbout && (
                    <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                        <ListItem
                            topDivider
                            title={'First Name'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{user.first}</Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            title={'Last Name'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{user.last}</Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            title={'Location'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{user.location}</Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            title={'Date of Birth'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>
                                        {user.birthday
                                            ? format(parse(user.birthday, 'yyyy-MM-dd', new Date()), 'dd-MMM-yyyy')
                                            : '--'}
                                    </Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            title={'Email Address'}
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
                                    <Typography>{user.email}</Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            title={'Avg. Score (18 Holes)'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{mapAverageToLabel(user.average)}</Typography>
                                </Stack>
                            )}
                        />
                        <ListItem
                            topDivider
                            bottomDivider
                            title={'Golf Goals'}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[style, { marginRight: 0 }]}
                                    {...rightProps}
                                >
                                    <Typography>{`${(user.goals || '').substring(0, 18)}...`}</Typography>
                                </Stack>
                            )}
                        />
                    </Stack>
                )}
                {/* Write Mode */}
                {editAbout && (
                    <Stack gap={theme.spacing.sm}>
                        <StyledTextInput
                            label={'First Name'}
                            value={personal.first}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onChangeText={(value: string): void => setPersonal({ ...personal, first: value })}
                            underlineColorAndroid={'transparent'}
                            multiline
                            numberOfLines={1}
                            submitBehavior={'blurAndSubmit'}
                            returnKeyType={'done'}
                            scrollEnabled={false}
                        />
                        <StyledTextInput
                            label={'Last Name'}
                            value={personal.last}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onChangeText={(value: string): void => setPersonal({ ...personal, last: value })}
                            underlineColorAndroid={'transparent'}
                            multiline
                            numberOfLines={1}
                            submitBehavior={'blurAndSubmit'}
                            returnKeyType={'done'}
                            scrollEnabled={false}
                        />
                        <StyledTextInput
                            label={'Location'}
                            value={personal.location}
                            placeholder={'e.g., Denver, CO'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onChangeText={(value: string): void => setPersonal({ ...personal, location: value })}
                            underlineColorAndroid={'transparent'}
                            multiline
                            numberOfLines={1}
                            submitBehavior={'blurAndSubmit'}
                            returnKeyType={'done'}
                            scrollEnabled={false}
                        />
                        <Stack>
                            <StyledTextInput
                                label={'Date of Birth'}
                                value={personal.birthday}
                                placeholder={'MM/DD/YYYY'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onFocus={(): void => {
                                    setShowDatePicker(true);
                                    Keyboard.dismiss();
                                }}
                                underlineColorAndroid={'transparent'}
                                multiline
                                numberOfLines={1}
                                submitBehavior={'blurAndSubmit'}
                                returnKeyType={'done'}
                                scrollEnabled={false}
                            />
                            <DateTimePicker
                                date={
                                    personal.birthday ? parse(personal.birthday, 'yyyy-MM-dd', new Date()) : new Date()
                                }
                                isVisible={showDatePicker}
                                pickerComponentStyleIOS={{ height: 300 }}
                                onConfirm={(date): void => {
                                    setShowDatePicker(false);
                                    setPersonal({ ...personal, birthday: format(new Date(date), 'yyyy-MM-dd') });
                                }}
                                onCancel={(): void => setShowDatePicker(false)}
                            />
                        </Stack>
                        <StyledTextInput
                            editable={false}
                            label={'Email Address'}
                            value={personal.email}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            disabled
                            underlineColorAndroid={'transparent'}
                            multiline
                            numberOfLines={1}
                            submitBehavior={'blurAndSubmit'}
                            returnKeyType={'done'}
                            scrollEnabled={false}
                        />
                        <RNPickerSelect
                            darkTheme={theme.dark}
                            placeholder={{ label: 'Choose One...', value: '', color: theme.colors.primary }}
                            items={[
                                { label: 'Under 70', value: '60' },
                                { label: '70-79', value: '70' },
                                { label: '80-89', value: '80' },
                                { label: '90-99', value: '90' },
                                { label: '100-149', value: '100' },
                                { label: '150+', value: '150' },
                            ]}
                            onValueChange={(value: string): void => {
                                setPersonal({ ...personal, average: value as ScoreRange });
                            }}
                            // @ts-expect-error this is a workaround for a bug in RNPickerSelect with new architecture
                            style={{ inputIOSContainer: { pointerEvents: 'none' } }}
                            value={personal.average}
                            useNativeAndroidPickerStyle={false}
                        >
                            <StyledTextInput
                                editable={false}
                                label={'Avg. Score (18 Holes)'}
                                underlineColorAndroid={'transparent'}
                                value={mapAverageToLabel(personal.average)}
                                multiline
                                numberOfLines={1}
                                submitBehavior={'blurAndSubmit'}
                                returnKeyType={'done'}
                                scrollEnabled={false}
                            />
                        </RNPickerSelect>

                        <StyledTextInput
                            label={'Golf Goals'}
                            multiline
                            value={personal.goals}
                            placeholder={'I want to be the next Tiger Woods...'}
                            autoCorrect={false}
                            autoCapitalize={'sentences'}
                            submitBehavior={'blurAndSubmit'}
                            maxLength={255}
                            returnKeyType={'done'}
                            spellCheck
                            textAlignVertical={'top'}
                            onChangeText={(value: string): void => setPersonal({ ...personal, goals: value })}
                            underlineColorAndroid={'transparent'}
                        />
                        <Typography style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}>{`${
                            255 - (personal.goals || '').length
                        } Characters Left`}</Typography>
                        {!objectsEqual(personal, user) && (
                            <SEButton
                                title={'Save Changes'}
                                onPress={(): void => {
                                    const newChanges: Partial<Level3UserDetailsApiResponse> = {};
                                    if (personal.first !== user.first) {
                                        newChanges.first = personal.first;
                                    }
                                    if (personal.last !== user.last) {
                                        newChanges.last = personal.last;
                                    }
                                    if (personal.location !== user.location) {
                                        newChanges.location = personal.location;
                                    }
                                    if (personal.goals !== user.goals) {
                                        newChanges.goals = personal.goals;
                                    }
                                    if (personal.average !== user.average) {
                                        newChanges.average = personal.average as ScoreRange;
                                    }
                                    if (personal.birthday !== user.birthday) {
                                        newChanges.birthday = personal.birthday;
                                    }
                                    if (personal.email !== user.email) {
                                        newChanges.email = personal.email;
                                    }
                                    if (personal.notify_new_lesson !== lessons) {
                                        newChanges.notify_new_lesson = personal.notify_new_lesson;
                                    }
                                    if (personal.notify_marketing !== marketing) {
                                        newChanges.notify_marketing = personal.notify_marketing;
                                    }
                                    if (personal.notify_newsletter !== newsletter) {
                                        newChanges.notify_newsletter = personal.notify_newsletter;
                                    }
                                    if (personal.notify_reminders !== reminders) {
                                        newChanges.notify_reminders = personal.notify_reminders;
                                    }

                                    if (Object.keys(newChanges).length > 0) {
                                        updateUserDetails(newChanges);
                                    }
                                    setEditAbout(false);
                                }}
                            />
                        )}
                    </Stack>
                )}

                <SectionHeader title={'User Settings'} style={{ marginTop: theme.spacing.xl }} />
                <ListItem
                    title={'Swing Handedness'}
                    titleEllipsizeMode={'tail'}
                    topDivider
                    bottomDivider
                    style={{ marginHorizontal: -1 * theme.spacing.md }}
                    onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'handed' })}
                    right={({ style, ...rightProps }): JSX.Element => (
                        <Stack direction={'row'} align={'center'} style={[style, { marginRight: 0 }]} {...rightProps}>
                            <Typography>{user.handed.charAt(0).toUpperCase() + user.handed.substring(1)}</Typography>
                            <Icon
                                name={'chevron-right'}
                                size={theme.size.md}
                                color={theme.colors.primary}
                                style={{ marginRight: -1 * theme.spacing.md }}
                            />
                        </Stack>
                    )}
                />

                <SectionHeader title={'Camera Settings'} style={{ marginTop: theme.spacing.xl }} />
                <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                    <ListItem
                        title={'Recording Duration'}
                        titleEllipsizeMode={'tail'}
                        topDivider
                        bottomDivider
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'camera_duration' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${user.camera_duration}s`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        title={'Recording Delay'}
                        titleEllipsizeMode={'tail'}
                        bottomDivider
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'camera_delay' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{user.camera_delay === 0 ? 'Off' : `${user.camera_delay}s`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        title={'Stance Overlay'}
                        titleEllipsizeMode={'tail'}
                        bottomDivider
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'camera_overlay' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${user.camera_overlay ? 'On' : 'Off'}`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                </Stack>

                <SectionHeader title={'Email Notifications'} style={{ marginTop: theme.spacing.xl }} />
                <Stack style={{ marginHorizontal: -1 * theme.spacing.md }}>
                    <ListItem
                        topDivider
                        bottomDivider
                        title={'Lessons'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'notify_new_lesson' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${lessons ? 'On' : 'Off'}`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Marketing'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'notify_marketing' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${marketing ? 'On' : 'Off'}`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Newsletters'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'notify_newsletter' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${newsletter ? 'On' : 'Off'}`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Reminders'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void => navigation.navigate(ROUTES.SETTING, { setting: 'notify_reminders' })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: 0 }]}
                                {...rightProps}
                            >
                                <Typography>{`${reminders ? 'On' : 'Off'}`}</Typography>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.primary}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                </Stack>
            </ScrollView>
        </Stack>
    );
};
