import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, SEHeader } from '../../components/index';
// Styles
import { useSharedStyles } from '../../styles';
import { spaces, sizes } from '../../styles/sizes';
import { useTheme } from 'react-native-paper';

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
        label: 'Handedness',
        description: 'Your dominant hand for golfing',
        values: ['Right', 'Left'],
    },
    {
        name: 'duration',
        label: 'Camera Duration',
        description: 'How long to record for each swing',
        values: [5, 8, 10],
    },
    {
        name: 'delay',
        label: 'Camera Delay',
        description: 'How long to wait between pressing record and the start of the recording',
        values: [0, 5, 10],
    },
    {
        name: 'overlay',
        label: 'Camera Overlay',
        description: 'Overlay shows an image of how you should stand while recording your swing',
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

    const [value, setValue]: [any, Function] = useState(settings[currentSettingName]);

    const _updateSetting = useCallback(() => {
        dispatch(
            putSettings({
                [currentSettingName]: value,
            }),
        );
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
                        paddingTop: HEADER_COLLAPSED_HEIGHT + spaces.medium,
                    },
                ]}>
                {currentSetting.values.map((val, index) => (
                    <ListItem
                        key={`Setting-Option-${index}`}
                        containerStyle={[sharedStyles.listItem]}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        onPress={(): void => setValue(val)}
                        title={
                            <Body>{`${typeof val === 'boolean' ? (val ? 'On' : 'Off') : val}${
                                typeof val === 'number' ? 's' : ''
                            }`}</Body>
                        }
                        rightIcon={
                            caseSame(value, val)
                                ? { name: 'check', color: theme.colors.text, size: sizes.small }
                                : undefined
                        }
                    />
                ))}
                <Body style={[sharedStyles.paddingHorizontalMedium, { marginTop: spaces.medium }]}>
                    {currentSetting.description}
                </Body>
            </View>
        </View>
    );
};
