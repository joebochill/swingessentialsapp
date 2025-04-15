import React, { useState, useCallback, useEffect, JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MatIcon from '@react-native-vector-icons/material-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { RootStackParamList, SettingsStackParamList } from '../../navigation/MainNavigation';
import { useNavigation, useRoute } from '@react-navigation/core';
import { UserAppSettings } from '../../redux/apiServices/userDetailsService';
import { Stack } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { Typography } from '../../components/typography';

type SettingType = {
    name: any; //Exclude<keyof SettingsState, 'loading' | 'notifications'> | keyof SettingsState['notifications'];
    label: string;
    description: string;
    values: number[] | string[] | boolean[];
};
const SETTINGS: SettingType[] = [
    {
        name: 'handedness',
        label: 'Swing Handedness',
        description: 'Your dominant hand for golfing',
        values: ['Right', 'Left'],
    },
    {
        name: 'duration',
        label: 'Recording Duration',
        description: 'How long to record for each swing',
        values: [5, 8, 10],
    },
    {
        name: 'delay',
        label: 'Recording Delay',
        description: 'How long to wait between pressing record and the start of the recording',
        values: [0, 5, 10],
    },
    {
        name: 'overlay',
        label: 'Stance Overlay',
        description:
            'The Stance Overlay shows a semi-transparent image of how you should stand while recording your swing',
        values: [true, false],
    },
    {
        name: 'lessons',
        label: 'Lesson Emails',
        description: 'Receive emails whenever your swing analysis has been posted or updated.',
        values: [true, false],
    },
    {
        name: 'marketing',
        label: 'Marketing Emails',
        description: 'Receive emails about upcoming sales, events, etc.',
        values: [true, false],
    },
    {
        name: 'newsletter',
        label: 'Newsletter Emails',
        description: 'Receive emails about news, tips, or other goings on.',
        values: [true, false],
    },
    {
        name: 'reminders',
        label: 'Reminder Emails',
        description: 'Receive emails about things you might have missed.',
        values: [true, false],
    },
];
const caseSame = (val1: string | number, val2: string | number): boolean => {
    if (typeof val1 === 'string' && typeof val2 === 'string') {
        return val1.toLowerCase() === val2.toLowerCase();
    }
    return val1 === val2;
};

export const SingleSetting: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<SettingsStackParamList>>();
    const route = useRoute();
    const settings = {} as any; //useSelector((state: ApplicationState) => state.settings);
    const token: string = ''; //useSelector((state: ApplicationState) => state.login.token);
    const { setting: currentSettingName } = { setting: '' }; //route.params;
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const [value, setValue] = useState(() => {
        if (Object.keys(settings.notifications).includes(currentSettingName)) {
            return settings.notifications[currentSettingName as keyof UserAppSettings];
        }
        return settings[currentSettingName as any /*Exclude<keyof SettingsState, 'loading' | 'notifications'>*/];
    });

    const updateSetting = useCallback(() => {
        if (Object.keys(settings.notifications).includes(currentSettingName)) {
            let key = 'lessons';
            switch (currentSettingName) {
                case 'marketing':
                    key = 'notify_marketing';
                    break;
                case 'newsletter':
                    key = 'notify_newsletter';
                    break;
                case 'reminders':
                    key = 'notify_reminders';
                    break;
                case 'lessons':
                default:
                    key = 'notify_new_lessons';
                    break;
            }
            // dispatch(
            //     putSettings({
            //         [key]: value,
            //     })
            // );
        } else {
            // dispatch(
            //     putSettings({
            //         [currentSettingName]: value,
            //     })
            // );
        }
    }, [dispatch, currentSettingName, value, settings.notifications]);

    useEffect(() => {
        if (!token) {
            // navigation.pop();
        }
    }, [navigation, token]);

    if (!currentSettingName) {
        // navigation.pop();
        return null;
    }
    const currentSetting: SettingType = SETTINGS.filter((setting) => setting.name === currentSettingName)[0];

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
                mainAction={'back'}
                title={'Settings'}
                subtitle={currentSetting.label}
                showAuth={false}
                onNavigate={(): void => updateSetting()}
                navigation={navigation}
                fixed
            />
            <Stack style={{ marginTop: theme.spacing.md }}>
                {currentSetting.values.map((val, index) => (
                    <ListItem
                        key={`option_${index}`}
                        topDivider={index === 0}
                        bottomDivider
                        title={`${typeof val === 'boolean' ? (val ? 'On' : 'Off') : val}${
                            typeof val === 'number' ? 's' : ''
                        }`}
                        titleEllipsizeMode={'tail'}
                        onPress={(): void => setValue(val)}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                {/* {caseSame(value, val) && (
                                    <MatIcon
                                        name={'check'}
                                        size={theme.size.md}
                                        color={theme.colors.primary}
                                        style={{ marginRight: -1 * theme.spacing.md }}
                                    />
                                )} */}
                            </Stack>
                        )}
                    />
                ))}
                <Typography style={{ marginTop: theme.spacing.sm, marginHorizontal: theme.spacing.md }}>
                    {currentSetting.description}
                </Typography>
            </Stack>
        </Stack>
    );
};
