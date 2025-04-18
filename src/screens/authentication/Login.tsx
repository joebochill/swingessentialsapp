import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCompare } from '../../utilities';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import { Switch } from 'react-native-paper';
import { height } from '../../utilities/dimensions';
import logo from '../../images/logo-big.png';
import { ROUTES } from '../../constants/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { BackgroundImage } from '../../components/BackgroundImage';
import { Stack } from '../../components/layout';
import { Typography } from '../../components/typography';
import { ErrorBox } from '../../components/feedback';
import { SEButton } from '../../components/SEButton';
import { RootState } from '../../redux/store';
import { useLoginMutation } from '../../redux/apiServices/authService';
import { StyledTextInput } from '../../components/inputs/StyledTextInput';
import { Icon } from '../../components/Icon';
import { LOG } from '../../utilities/logs';

type BiometryState = {
    available: boolean;
    type: 'FaceID' | 'TouchID' | 'Fingerprint' | 'None';
};
type CredentialsState = {
    stored: boolean;
    savedCredentials:
        | {
              username: string;
              password: string;
              service?: string;
          }
        | undefined;
};
const initialBiometry: BiometryState = {
    available: false,
    type: 'None',
};
const initialCredentials: CredentialsState = {
    stored: false,
    savedCredentials: undefined,
};

export const Login: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    // Local Component State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [useBiometry, setUseBiometry] = useState(false);
    const [missingDataError, setMissingDataError] = useState(false);
    const [touchFail, setTouchFail] = useState('');
    const [biometry, setBiometry] = useState(initialBiometry);
    const [credentials, setCredentials] = useState(initialCredentials);

    const [login, { isSuccess: loggedIn, isLoading: pending, isError }] = useLoginMutation();
    const failures = useSelector((state: RootState) => state.auth.loginFailures);
    const token = useSelector((state: RootState) => state.auth.token);
    const failuresChanged = useCompare(failures);
    const dispatch = useDispatch();
    // Refs
    const passField = useRef(null);

    useEffect(() => {
        // Load saved settings
        const loadSavedSettings = async (): Promise<void> => {
            try {
                const save = await AsyncStorage.getItem('@SwingEssentials:saveUser');
                const use = await AsyncStorage.getItem('@SwingEssentials:useTouch');
                const storedUser = await AsyncStorage.getItem('@SwingEssentials:lastUser');
                setUsername(storedUser || username);
                setRemember(save === 'yes');
                setUseBiometry(use === 'yes');
            } catch (err: any) {
                LOG.error(`Failed to load stored auth settings: ${err}`, { zone: 'AUTH' });
            }
        };
        void loadSavedSettings();
    }, []);

    useEffect(() => {
        // Load biometric type
        const touchCheck = async (): Promise<void> => {
            try {
                const biometricType = await TouchID.isSupported();
                setBiometry({
                    ...biometry,
                    // @ts-expect-error isSupported can return a boolean on some devices instead of a string
                    type: biometricType === true ? 'Fingerprint' : biometricType,
                    available: true,
                });
            } catch (err) {
                setBiometry({ ...biometry, available: false });
            }
        };
        void touchCheck();
    }, []);

    useEffect(() => {
        // Load stored credentials
        const loadKeychainCredentials = async (): Promise<void> => {
            try {
                const keychainCredentials = await Keychain.getGenericPassword();

                if (keychainCredentials) {
                    setCredentials((c) => ({
                        ...c,
                        stored: true,
                        savedCredentials: keychainCredentials,
                    }));
                    if (remember) {
                        setUsername(keychainCredentials.username);
                    }
                } else {
                    setCredentials((c) => ({
                        ...c,
                        stored: false,
                        savedCredentials: undefined,
                    }));
                }
            } catch (err: any) {
                LOG.error(`Failed to load stored credentials: ${err}`, { zone: 'AUTH' });
            }
        };
        void loadKeychainCredentials();
    }, [token, missingDataError, remember]);

    useEffect(() => {
        // handle successful login
        if (token) {
            navigation.pop();
        }
    }, [token, navigation]);

    useEffect(() => {
        // handle login failure
        if (failuresChanged) {
            setPassword('');
            if (failures > 0) {
                setCredentials({ ...credentials, stored: false });
                void Keychain.resetGenericPassword();
            }
        }
    }, [failuresChanged, failures, credentials]);

    const onLogin = useCallback(
        (user: string, pass: string) => {
            if (!user || !pass) {
                setMissingDataError(true);
                return;
            }
            setMissingDataError(false);
            login({ username: user, password: pass, remember, useBiometry });
        },
        [dispatch, useBiometry, remember]
    );

    const showBiometricLogin = useCallback(async () => {
        if (
            !credentials.stored ||
            !credentials.savedCredentials ||
            !useBiometry ||
            !biometry.available ||
            !biometry.type
        ) {
            return;
        }
        try {
            await TouchID.authenticate('Secure Sign In');
            onLogin(credentials.savedCredentials.username, credentials.savedCredentials.password);
        } catch (err: any) {
            const label = biometry.type === 'None' ? 'Biometric authentication' : biometry.type;
            switch (err.name) {
                case 'LAErrorAuthenticationFailed':
                case 'RCTTouchIDUnknownError':
                    // authentication failed
                    setTouchFail(`Your ${label} was not recognized. Please sign in using your password.`);
                    break;
                case 'LAErrorPasscodeNotSet':
                case 'LAErrorTouchIDNotAvailable':
                case 'LAErrorTouchIDNotEnrolled':
                case 'RCTTouchIDNotSupported':
                    setTouchFail(`${label} is not enabled on your device.`);
                    break;
                case 'LAErrorUserCancel':
                case 'LAErrorUserFallback':
                case 'LAErrorSystemCancel': // user canceled touch id - fallback to password
                default:
                    break;
            }
        }
    }, [biometry.available, biometry.type, credentials.savedCredentials, credentials.stored, onLogin, useBiometry]);

    useEffect(() => {
        // Show biometric login on load
        if (!token && useBiometry && biometry.available && credentials.stored) {
            void showBiometricLogin();
        }
    }, [token, useBiometry, biometry.available, credentials.stored, showBiometricLogin]);

    return (
        <BackgroundImage>
            <KeyboardAvoidingView style={[{ flex: 1 }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        minHeight: height - insets.top,
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
                                height: 60,
                                width: '100%',
                                resizeMode: 'contain',
                                marginBottom: theme.spacing.md,
                            }}
                        />

                        {/* Username Field */}
                        <Stack>
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
                            {biometry.available && useBiometry && credentials.stored && (
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
                                        onPress={async (): Promise<void> => await showBiometricLogin()}
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
                            style={{ marginTop: theme.spacing.md }}
                        >
                            <Stack direction={'row'} align={'center'}>
                                <Typography style={{ marginRight: theme.spacing.sm }} color={'onPrimary'}>
                                    Save Username
                                </Typography>
                                <Switch
                                    value={remember}
                                    onValueChange={(val: boolean): void => {
                                        setRemember(val);
                                        void AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                                        if (!val) {
                                            void AsyncStorage.removeItem('@SwingEssentials:lastUser');
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
                            {biometry.available && (
                                <Stack direction={'row'} align={'center'}>
                                    <Typography
                                        color={'onPrimary'}
                                        style={{ marginRight: theme.spacing.sm }}
                                    >{`Use ${biometry.type}`}</Typography>
                                    <Switch
                                        value={useBiometry}
                                        onValueChange={(val: boolean): void => {
                                            setUseBiometry(val);
                                            void AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
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
                            style={{ marginTop: theme.spacing.md }}
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
                                onPress={(): void => navigation.pop()}
                            />
                        </Stack>

                        {/* Registration Links */}
                        <Stack
                            direction={'row'}
                            align={'center'}
                            justify={'space-between'}
                            style={{ marginTop: theme.spacing.xs }}
                        >
                            <SEButton
                                mode={'text'}
                                labelStyle={{ color: theme.colors.onPrimary }}
                                title="Forgot Password?"
                                onPress={(): void => navigation.push(ROUTES.RESET_PASSWORD)}
                            />
                            <SEButton
                                mode={'text'}
                                labelStyle={{ color: theme.colors.onPrimary }}
                                title="Need an Account?"
                                onPress={(): void => navigation.push(ROUTES.REGISTER)}
                            />
                        </Stack>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </BackgroundImage>
    );
};
