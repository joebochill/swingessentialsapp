import logo from '@/assets/images/logo-big.png';
import pga from '@/assets/images/pga.png';
import { BackgroundImage } from '@/components/common/BackgroundImage';
import { Icon } from '@/components/common/Icon';
import { SEButton } from '@/components/common/SEButton';
import { ErrorBox } from '@/components/feedback/ErrorBox';
import { StyledTextInput } from '@/components/inputs/StyledTextInput';
import { Stack } from '@/components/layout/Stack';
import { Typography } from '@/components/typography/Typography';
import { useCompare } from '@/hooks';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { useStoredCredentials } from '@/hooks/useStoredCredetials';
import { LOG } from '@/logger';
import { useLoginMutation } from '@/redux/apiServices/authService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { height } from '@/utilities/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, View } from 'react-native';
// import * as Keychain from "react-native-keychain";
import { Switch } from 'react-native-paper';
// import TouchID from "react-native-touch-id";
import { useSelector } from 'react-redux';

export default function LoginScreen() {
    const router = useRouter();
    const theme = useAppTheme();

    // Local Component State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [useBiometry, setUseBiometry] = useState(false);
    const [missingDataError, setMissingDataError] = useState(false);
    const [touchFail, setTouchFail] = useState('');
    const { isBiometricAvailable, showBiometricPrompt, biometricLabel } = useBiometricLogin();
    const [promptingBiometric, setPromptingBiometric] = useState(false);
    const { credentials, clearPassword } = useStoredCredentials();

    const [login, { isSuccess: loggedIn, isLoading: pending, isError }] = useLoginMutation();
    const failures = useSelector((state: RootState) => state.auth.loginFailures);
    const token = useSelector((state: RootState) => state.auth.token);
    const failuresChanged = useCompare(failures);
    // Refs
    const passField = useRef(null);

    // Load saved settings on mount
    useEffect(() => {
        const loadSavedSettings = async (): Promise<void> => {
            try {
                const saveUsername = await AsyncStorage.getItem('@SwingEssentials:saveUser');
                const useBiometry = await AsyncStorage.getItem('@SwingEssentials:useTouch');
                setRemember(saveUsername === 'yes');
                setUseBiometry(useBiometry === 'yes');
            } catch (err: any) {
                LOG.error(`Failed to load stored auth settings: ${err}`, {
                    zone: 'AUTH',
                });
            }
        };
        loadSavedSettings();
    }, []);

    // Populate remembered username
    useEffect(() => {
        if (remember && credentials.username) {
            setUsername(credentials.username);
        }
    }, [credentials.username, remember]);

    // handle successful login
    useEffect(() => {
        if (token) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        }
    }, [token, router]);

    // handle failed login attempts
    useEffect(() => {
        if (failuresChanged) {
            setPassword('');
            if (failures > 0) {
                clearPassword();
            }
        }
    }, [failuresChanged, failures, credentials, clearPassword]);

    // Log in with username and password
    const onLogin = useCallback(
        (user: string, pass: string) => {
            if (!user || !pass) {
                setMissingDataError(true);
                return;
            }
            setMissingDataError(false);
            login({ username: user, password: pass, remember, useBiometry });
        },
        [useBiometry, remember, login]
    );

    // Shows the biometric login prompt and handles authentication
    const showBiometricLogin = useCallback(async () => {
        if (!(credentials.password && credentials.username) || !useBiometry || !isBiometricAvailable) {
            return;
        }
        try {
            const success = await showBiometricPrompt();
            if (success) {
                onLogin(credentials.username, credentials.password);
            } else {
                setTouchFail(`Your ${biometricLabel} was not recognized. Please sign in using your password.`);
            }
        } catch (err: any) {
            LOG.error(`Biometric login failed: ${err}`, { zone: 'AUTH' });
            setTouchFail(`We were unable to process your ${biometricLabel} login. Please sign in using your password.`);
        }
    }, [
        credentials.password,
        credentials.username,
        useBiometry,
        isBiometricAvailable,
        showBiometricPrompt,
        biometricLabel,
        onLogin,
    ]);

    // Show biometric login on mount if able
    useEffect(() => {
        if (
            !token &&
            useBiometry &&
            isBiometricAvailable &&
            credentials.password &&
            credentials.username &&
            !promptingBiometric
        ) {
            setPromptingBiometric(true);
            showBiometricLogin();
        }
    }, [
        token,
        useBiometry,
        isBiometricAvailable,
        credentials.password,
        credentials.username,
        showBiometricLogin,
        promptingBiometric,
    ]);

    return (
        <BackgroundImage>
            <KeyboardAvoidingView style={[{ flex: 1 }]} behavior={'padding'}>
                <Image
                    source={pga}
                    resizeMethod="resize"
                    style={{
                        height: 100,
                        position: 'absolute',
                        width: '100%',
                        resizeMode: 'contain',
                        bottom: 48,
                        opacity: 0.75,
                    }}
                />
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        minHeight: height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: theme.spacing.md,
                    }}
                    keyboardShouldPersistTaps={'always'}
                >
                    {/* LOGO */}
                    <View style={{ width: '100%', maxWidth: 500 }}>
                        <Image
                            source={logo}
                            resizeMethod="resize"
                            style={{
                                height: 100,
                                width: '100%',
                                resizeMode: 'contain',
                                marginBottom: theme.spacing.md,
                            }}
                        />

                        {/* Username Field */}
                        <Stack style={{ marginTop: theme.spacing.sm }}>
                            <StyledTextInput
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                editable={!pending}
                                label={'Username'}
                                onChangeText={(val: string): void => setUsername(val)}
                                onSubmitEditing={(): void => {
                                    if (passField.current) {
                                        // @ts-expect-error passField is a ref to a TextInput
                                        passField.current.focus();
                                    }
                                }}
                                placeholder="Enter your username or email address"
                                returnKeyType={'next'}
                                underlineColorAndroid={'transparent'}
                                value={username}
                            />
                            {isBiometricAvailable && useBiometry && credentials.password && credentials.username && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: theme.spacing.md,
                                        bottom: 0,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Icon
                                        name={'fingerprint'}
                                        size={theme.size.md}
                                        color={theme.colors.onPrimaryContainer}
                                        // underlayColor={'transparent'}
                                        onPress={async (): Promise<void> => {
                                            await showBiometricLogin();
                                        }}
                                    />
                                </View>
                            )}
                        </Stack>

                        {/* Password Field */}
                        <StyledTextInput
                            autoCapitalize={'none'}
                            editable={!pending}
                            label={'Password'}
                            onChangeText={(val: string): void => setPassword(val)}
                            onSubmitEditing={(): void => onLogin(username, password)}
                            placeholder="Enter your password"
                            ref={passField}
                            returnKeyType={'go'}
                            secureTextEntry
                            underlineColorAndroid={'transparent'}
                            value={password}
                            style={{
                                marginTop: theme.spacing.md,
                            }}
                        />

                        {/* Remember Me Row */}
                        <Stack
                            direction={'row'}
                            align={'center'}
                            justify={'space-between'}
                            style={{ marginTop: theme.spacing.lg }}
                        >
                            <Stack direction={'row'} align={'center'}>
                                <Typography style={{ marginRight: theme.spacing.sm }} color={'onPrimary'}>
                                    Save Username
                                </Typography>
                                <Switch
                                    value={remember}
                                    onValueChange={(val: boolean): void => {
                                        setRemember(val);
                                        AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                                        if (!val) {
                                            setUsername('');
                                        }
                                    }}
                                    ios_backgroundColor={
                                        theme.dark ? theme.colors.background : theme.colors.primaryContainer
                                    }
                                    trackColor={{
                                        false: theme.dark ? theme.colors.background : theme.colors.primaryContainer,
                                        true: theme.colors.onPrimaryContainer,
                                    }}
                                />
                            </Stack>
                            {isBiometricAvailable && (
                                <Stack direction={'row'} align={'center'}>
                                    <Typography
                                        color={'onPrimary'}
                                        style={{ marginRight: theme.spacing.sm }}
                                    >{`Use ${biometricLabel}`}</Typography>
                                    <Switch
                                        value={useBiometry}
                                        onValueChange={(val: boolean): void => {
                                            if (!val) {
                                                clearPassword();
                                            }
                                            setUseBiometry(val);
                                            AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
                                        }}
                                        ios_backgroundColor={
                                            theme.dark ? theme.colors.background : theme.colors.primaryContainer
                                        }
                                        trackColor={{
                                            false: theme.dark ? theme.colors.background : theme.colors.primaryContainer,
                                            true: theme.colors.onPrimaryContainer,
                                        }}
                                    />
                                </Stack>
                            )}
                        </Stack>

                        {/* Error Messages */}
                        {!loggedIn && (
                            <>
                                <ErrorBox
                                    show={(failures > 0 || missingDataError) && !pending}
                                    error={'The username / password you entered was not correct.'}
                                    style={{ marginTop: theme.spacing.md }}
                                />
                                <ErrorBox
                                    show={isError && failures <= 0 && !missingDataError && !pending}
                                    error={
                                        'We were unable to process your login request. Check your network connection and try again.'
                                    }
                                    style={{ marginTop: theme.spacing.md }}
                                />
                                <ErrorBox
                                    show={touchFail.length > 0 && failures <= 0}
                                    error={touchFail}
                                    style={{ marginTop: theme.spacing.md }}
                                />
                            </>
                        )}

                        {/* Log In Buttons */}
                        <Stack
                            direction={'row'}
                            align={'center'}
                            gap={theme.spacing.sm}
                            style={{ marginTop: theme.spacing.lg }}
                        >
                            <SEButton
                                title={'Sign In'}
                                buttonColor={theme.dark ? undefined : theme.colors.secondary}
                                loading={pending}
                                style={{
                                    flex: 1,
                                }}
                                onPress={(): void => onLogin(username, password)}
                            />
                            <SEButton
                                mode={'text'}
                                disabled={pending}
                                labelStyle={{ color: theme.colors.onPrimary }}
                                style={{ flex: 0 }}
                                title="CANCEL"
                                onPress={(): void => {
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.replace('/');
                                    }
                                }}
                            />
                        </Stack>

                        {/* Registration Links */}
                        <Stack
                            direction={'row'}
                            align={'center'}
                            justify={'space-between'}
                            style={{ marginTop: theme.spacing.md }}
                        >
                            <SEButton
                                mode={'text'}
                                labelStyle={{ color: theme.colors.onPrimary }}
                                title="Forgot Password?"
                                onPress={(): void => {
                                    router.push('/forgot-password');
                                }}
                            />
                            <SEButton
                                mode={'text'}
                                labelStyle={{ color: theme.colors.onPrimary }}
                                title="Need an Account?"
                                onPress={(): void => {
                                    router.push('/(auth)/(register)');
                                }}
                            />
                        </Stack>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </BackgroundImage>
    );
}
