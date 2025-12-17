import { SETTINGS, SettingType } from '@/_config/shared';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Typography } from '@/components/typography/Typography';
import {
    BLANK_USER,
    useGetUserDetailsQuery,
    UserAppSettings,
    useUpdateUserDetailsMutation,
} from '@/redux/apiServices/userDetailsService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function SingleSettingScreen() {
    const router = useRouter();
    const { 'setting-name': key } = useLocalSearchParams();
    const setting = key as keyof UserAppSettings;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const token = useSelector((state: RootState) => state.auth.token);
    const { data: user = BLANK_USER } = useGetUserDetailsQuery();
    const [updateUserDetails] = useUpdateUserDetailsMutation();

    const [value, setValue] = useState(() => {
        return user[setting];
    });

    const updateSetting = useCallback(() => {
        updateUserDetails({
            [setting]: typeof value === 'string' ? value.toLowerCase() : value,
        });
    }, [setting, value, updateUserDetails]);

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
        if (!setting) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        }
    }, [router, setting]);

    if (!setting) {
        return null;
    }

    const currentSetting: SettingType = SETTINGS.find((setting) => setting.name === key) as SettingType;

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
                                        style={{ marginRight: -1 * theme.spacing.sm }}
                                    />
                                )}
                            </Stack>
                        )}
                    />
                ))}
                <Typography
                    style={{
                        marginTop: theme.spacing.sm,
                        marginHorizontal: theme.spacing.md,
                    }}
                >
                    {currentSetting.description}
                </Typography>
            </Stack>
        </Stack>
    );
}
