import { BASE_URL } from '@/_config';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { SEButton } from '@/components/common/SEButton';
import { StyledTextInput } from '@/components/inputs/StyledTextInput';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import {
    BLANK_USER,
    Level3UserDetailsApiResponse,
    ScoreRange,
    useGetUserDetailsQuery,
    useUpdateUserDetailsMutation,
} from '@/redux/apiServices/userDetailsService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { height, width } from '@/utilities/dimensions';
import { format, isValid } from 'date-fns';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, Image as RNImage, RefreshControl, ScrollView, View } from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

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

export default function ProfileScreen() {
    const router = useRouter();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: user = BLANK_USER, isFetching, refetch } = useGetUserDetailsQuery();
    const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();
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

    const onSave = useCallback((): void => {
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
            newChanges.birthday = format(new Date(personal.birthday), 'yyyy-MM-dd');
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
    }, [personal, user, lessons, marketing, newsletter, reminders, updateUserDetails]);

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!token) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        }
    }, [router, token]);

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
                        tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
                    />
                }
            >
                {/* AVATAR SECTION */}
                <View style={{ alignSelf: 'center' }}>
                    <Pressable
                        onPress={async (): Promise<void> => {
                            const result = await launchImageLibraryAsync({
                                mediaTypes: ['images'],
                                allowsEditing: true,
                                aspect: [1, 1],
                                base64: true,
                                quality: 0.8,
                                selectionLimit: 1,
                                shape: 'oval',
                            });
                            //TODO error handling via try catch
                            if (result.canceled) {
                                // Do Nothing
                            } else {
                                if (result.assets && result.assets.length > 0) {
                                    updateUserDetails({
                                        avatar: result.assets[0].base64 ?? '',
                                    });
                                }
                            }
                        }}
                        style={({ pressed }) => [
                            {
                                width: width / 2,
                                height: width / 2,
                                maxWidth: 200,
                                maxHeight: 200,
                                alignSelf: 'center',
                                borderRadius: width / 4,
                                overflow: 'hidden',
                                backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primaryContainer,
                            },
                            pressed && {
                                transform: [{ scale: 0.99 }],
                            },
                        ]}
                    >
                        <View>
                            <RNImage source={{ uri: avatarURL }} style={{ width: '100%', height: '100%' }} />
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                            >
                                <IconButton
                                    mode={'contained'}
                                    icon="edit"
                                    iconColor={theme.colors.onPrimary}
                                    containerColor={'rgba(0,0,0,0.5)'}
                                />
                            </View>
                        </View>
                    </Pressable>
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
                    style={{ marginTop: theme.spacing.md, minHeight: 40 }}
                    action={
                        !isLoading && !isFetching ? (
                            <Stack direction={'row'} gap={theme.spacing.md}>
                                <SEButton
                                    mode={'outlined'}
                                    title={editAbout ? 'Cancel' : 'Edit'}
                                    onPress={(): void => {
                                        setEditAbout(!editAbout);
                                        setPersonal(user);
                                    }}
                                />
                                {!objectsEqual(personal, user) && <SEButton title={'Save'} onPress={onSave} />}
                            </Stack>
                        ) : (
                            <ActivityIndicator />
                        )
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
                                        {user.birthday && isValid(new Date(user.birthday))
                                            ? format(new Date(user.birthday), 'dd-MMM-yyyy')
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
                                value={format(new Date(personal.birthday), 'dd-MMM-yyyy')}
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
                                date={personal.birthday ? new Date(personal.birthday) : new Date()}
                                isVisible={showDatePicker}
                                pickerComponentStyleIOS={{ height: 300 }}
                                onConfirm={(date): void => {
                                    setShowDatePicker(false);
                                    setPersonal({
                                        ...personal,
                                        birthday: date.toISOString(),
                                    });
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
                            placeholder={{
                                label: 'Choose One...',
                                value: '',
                                color: theme.dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.25)',
                            }}
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
                        {!objectsEqual(personal, user) && !isLoading && !isFetching && (
                            <SEButton title={'Save Changes'} onPress={onSave} />
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
                    onPress={(): void =>
                        router.push({
                            pathname: '/(drawer)/(screens)/settings/[setting-name]',
                            params: { 'setting-name': 'handed' },
                        })
                    }
                    right={({ style, ...rightProps }): JSX.Element => (
                        <Stack direction={'row'} align={'center'} style={[style, { marginRight: 0 }]} {...rightProps}>
                            <Typography>{user.handed.charAt(0).toUpperCase() + user.handed.substring(1)}</Typography>
                            <Icon
                                name={'chevron-right'}
                                size={theme.size.md}
                                color={theme.colors.primary}
                                style={{ marginRight: -1 * theme.spacing.sm }}
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
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'camera_duration' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        title={'Recording Delay'}
                        titleEllipsizeMode={'tail'}
                        bottomDivider
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'camera_delay' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        title={'Stance Overlay'}
                        titleEllipsizeMode={'tail'}
                        bottomDivider
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'camera_overlay' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
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
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'notify_new_lesson' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Marketing'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'notify_marketing' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Newsletters'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'notify_newsletter' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                    <ListItem
                        bottomDivider
                        title={'Reminders'}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/settings/[setting-name]',
                                params: { 'setting-name': 'notify_reminders' },
                            })
                        }
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
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </Stack>
                        )}
                    />
                </Stack>
            </ScrollView>
        </Stack>
    );
}
