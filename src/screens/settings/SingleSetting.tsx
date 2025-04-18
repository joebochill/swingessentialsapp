import React, { useState, useCallback, useEffect, JSX } from 'react';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { SettingsStackParamList } from '../../navigation/MainNavigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import {
    BLANK_USER,
    useGetUserDetailsQuery,
    UserAppSettings,
    useUpdateUserDetailsMutation,
} from '../../redux/apiServices/userDetailsService';
import { Stack } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { Typography } from '../../components/typography';
import { RootState } from '../../redux/store';
import { SETTINGS, SettingType } from './shared';
import { Icon } from '../../components/Icon';

export const SingleSetting: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
    const route = useRoute<RouteProp<SettingsStackParamList, 'SETTING'>>();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const token = useSelector((state: RootState) => state.auth.token);
    const { data: user = BLANK_USER, isSuccess: hasUserData, isFetching, refetch } = useGetUserDetailsQuery();
    const [updateUserDetails] = useUpdateUserDetailsMutation();

    const [value, setValue] = useState(() => {
        return user[route.params.setting as keyof UserAppSettings];
    });

    const updateSetting = useCallback(() => {
        updateUserDetails({
            [route.params.setting]: typeof value === 'string' ? value.toLowerCase() : value,
        });
    }, [route.params.setting, value, updateUserDetails, refetch]);

    useEffect(() => {
        if (!token) {
            navigation.pop();
        }
    }, [navigation, token]);

    if (!route.params.setting) {
        navigation.pop();
        return null;
    }

    const currentSetting: SettingType = SETTINGS.find(
        (setting) => setting.name === route.params.setting
    ) as SettingType;

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
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <Stack style={{ marginTop: theme.spacing.md }}>
                {currentSetting.values.map((val, index) => (
                    <ListItem
                        key={`option_${index}`}
                        topDivider={index === 0}
                        bottomDivider
                        title={currentSetting.labels ? currentSetting.labels[index] : currentSetting.values[index]}
                        titleEllipsizeMode={'tail'}
                        // @ts-expect-error we know val will be of the correct type here
                        onPress={(): void => setValue(val)}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                {value === val && (
                                    <Icon
                                        name={'check'}
                                        size={theme.size.md}
                                        color={theme.colors.onPrimaryContainer}
                                        style={{ marginRight: -1 * theme.spacing.md }}
                                    />
                                )}
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
