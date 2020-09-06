import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { Body, SEHeader } from '../../components/index';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { useTheme, List, Divider } from 'react-native-paper';

// Types
import { SettingsState, ApplicationState } from '../../__types__';
import { NavigationStackScreenProps } from 'react-navigation-stack';
// Redux
import { putSettings } from '../../redux/actions/SettingsActions';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

type SettingType = {
    name: keyof Exclude<SettingsState, 'loading'>;
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
        name: 'notifications',
        label: 'New Lesson Email Notification',
        description:
            'Send you an email whenever your swing analysis has been posted or updated.',
        values: [true, false],
    },
];
const caseSame = (val1: string | number, val2: string | number): boolean => {
    if (typeof val1 === 'string' && typeof val2 === 'string') {
        return val1.toLowerCase() === val2.toLowerCase();
    }
    return val1 === val2;
};

export const SingleSetting = (props: NavigationStackScreenProps) => {
    const { navigation } = props;
    const settings = useSelector((state: ApplicationState) => state.settings);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const currentSettingName: keyof SettingsState = navigation.getParam('setting', null);

    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    const [value, setValue] = useState(settings[currentSettingName]);

    const _updateSetting = useCallback(() => {
        if (currentSettingName === 'notifications') {
            dispatch(
                putSettings({
                    subscribe: value,
                }))
        }
        else {
            dispatch(
                putSettings({
                    [currentSettingName]: value,
                }))
        }
    }, [dispatch, currentSettingName, value]);

    useEffect(() => {
        if (!token) {
            navigation.pop();
        }
    }, [navigation, token]);

    if (!currentSettingName) {
        navigation.pop();
        return null;
    }
    const currentSetting: SettingType = SETTINGS.filter(setting => setting.name === currentSettingName)[0];

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                mainAction={'back'}
                title={'Settings'}
                subtitle={currentSetting.label}
                showAuth={false}
                onNavigate={() => _updateSetting()}
            />
            <View
                style={[
                    sharedStyles.pageContainer,
                    {
                        paddingTop: HEADER_COLLAPSED_HEIGHT + theme.spaces.medium,
                    },
                ]}>
                {currentSetting.values.map((val, index) => (
                    <View key={`option_${index}`}>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={`${typeof val === 'boolean' ? (val ? 'On' : 'Off') : val}${
                                typeof val === 'number' ? 's' : ''
                                }`}
                            titleEllipsizeMode={'tail'}
                            onPress={(): void => setValue(val)}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    {caseSame(value, val) && (
                                        <MatIcon
                                            name={'check'}
                                            size={theme.sizes.small}
                                            color={theme.colors.accent}
                                            style={{
                                                marginRight: -1 * theme.spaces.xSmall,
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        />
                        <Divider />
                    </View>
                ))}
                <Body style={[flexStyles.paddingHorizontal, { marginTop: theme.spaces.medium }]}>
                    {currentSetting.description}
                </Body>
            </View>
        </View>
    );
};
