import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { Typography, SEHeader, Stack, ListItem } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { Divider } from 'react-native-paper';

// Types
import { SettingsState, ApplicationState, NotificationSettings } from '../../__types__';
import { StackScreenProps } from '@react-navigation/stack';
// Redux
import { putSettings } from '../../redux/actions/SettingsActions';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';

type SettingType = {
    name: Exclude<keyof SettingsState, 'loading' | 'notifications'> | keyof SettingsState['notifications'];
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

export const SingleSetting: React.FC<StackScreenProps<RootStackParamList, 'SingleSetting'>> = (props) => {
    const { navigation, route } = props;
    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const { setting: currentSettingName } = route.params;
    const dispatch = useDispatch();
    const theme = useAppTheme();

    const [value, setValue] = useState(() => {
        if (Object.keys(settings.notifications).includes(currentSettingName)) {
            return settings.notifications[currentSettingName as keyof NotificationSettings];
        }
        return settings[currentSettingName as Exclude<keyof SettingsState, 'loading' | 'notifications'>];
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
            dispatch(
                // @ts-ignore
                putSettings({
                    [key]: value,
                })
            );
        } else {
            dispatch(
                // @ts-ignore
                putSettings({
                    [currentSettingName]: value,
                })
            );
        }
    }, [dispatch, currentSettingName, value, settings.notifications]);

    useEffect(() => {
        if (!token) {
            navigation.pop();
        }
    }, [navigation, token]);

    if (!currentSettingName) {
        navigation.pop();
        return null;
    }
    const currentSetting: SettingType = SETTINGS.filter((setting) => setting.name === currentSettingName)[0];

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
                mainAction={'back'}
                title={'Settings'}
                subtitle={currentSetting.label}
                showAuth={false}
                onNavigate={(): void => updateSetting()}
                navigation={navigation}
            />
            <Stack style={{ marginTop: theme.spacing.md }}>
                {currentSetting.values.map((val, index) => (
                    <View key={`option_${index}`}>
                        {index === 0 && <Divider />}
                        <ListItem
                            title={`${typeof val === 'boolean' ? (val ? 'On' : 'Off') : val}${
                                typeof val === 'number' ? 's' : ''
                            }`}
                            titleEllipsizeMode={'tail'}
                            onPress={(): void => setValue(val)}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                    {/* @ts-ignore */}
                                    {caseSame(value, val) && (
                                        <MatIcon
                                            name={'check'}
                                            size={theme.size.md}
                                            color={theme.colors.primary}
                                            style={{ marginRight: -1 * theme.spacing.md }}
                                        />
                                    )}
                                </Stack>
                            )}
                        />
                        <Divider />
                    </View>
                ))}
                <Typography style={{ marginTop: theme.spacing.sm, marginHorizontal: theme.spacing.md }}>
                    {currentSetting.description}
                </Typography>
            </Stack>
        </Stack>
    );
};
