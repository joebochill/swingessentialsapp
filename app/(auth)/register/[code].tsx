import { BackgroundImage } from '@/components/common/BackgroundImage';
import { Icon } from '@/components/common/Icon';
import { SEButton } from '@/components/common/SEButton';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Typography } from '@/components/typography/Typography';
import { useVerifyUserEmailMutation } from '@/redux/apiServices/registrationService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();
    const { code } = useLocalSearchParams();
    const codeString = Array.isArray(code) ? code[0] : code;

    const token = useSelector((state: RootState) => state.auth.token);
    const [verifyUserEmail, { isLoading, error, isUninitialized, isSuccess }] = useVerifyUserEmailMutation();

    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (codeString) {
            verifyUserEmail(codeString);
        }
    }, [codeString, verifyUserEmail]);

    return (
        <Stack style={[{ flex: 1 }]}>
            <Header
                title={'Sign Up'}
                subtitle={'Confirm your email'}
                mainAction={'back'}
                showAuth={false}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <BackgroundImage>
                <Stack
                    justify={'center'}
                    style={[
                        {
                            flex: 1,
                            padding: theme.spacing.md,
                            paddingTop: COLLAPSED_HEIGHT + insets.top,
                        },
                    ]}
                >
                    {isLoading && (
                        <>
                            <ActivityIndicator size={'large'} color={theme.colors.onPrimary} />
                            <Typography variant={'bodyLarge'} align={'center'} color={'onPrimary'}>
                                {`Verifying your email address...`}
                            </Typography>
                        </>
                    )}
                    {!isUninitialized && !isLoading && isSuccess && (
                        <>
                            <Icon
                                name={'check-circle'}
                                size={theme.size.xxl}
                                color={theme.colors.onPrimary}
                                style={{ alignSelf: 'center' }}
                            />
                            <Typography variant={'bodyLarge'} color={'onPrimary'} align={'center'}>
                                {`Your email address has been confirmed. ${
                                    token ? `Let's get started!` : `Please sign in to view your account.`
                                }`}
                            </Typography>
                            <SEButton
                                buttonColor={theme.colors.secondary}
                                title={token ? 'GET STARTED' : 'SIGN IN'}
                                onPress={(): void => {
                                    router.replace('/login');
                                }}
                                style={{ marginTop: theme.spacing.md }}
                            />
                        </>
                    )}
                    {!isUninitialized && !isLoading && error && (
                        <>
                            <Icon
                                name={'error'}
                                size={theme.size.xxl}
                                color={theme.colors.onPrimary}
                                style={{ alignSelf: 'center' }}
                            />
                            <Typography variant={'bodyLarge'} color={'onPrimary'} align={'center'}>
                                {error as string}
                            </Typography>
                        </>
                    )}
                </Stack>
            </BackgroundImage>
        </Stack>
    );
}
