import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCompare } from '../../utilities';

// Components
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Utilities
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Logger } from '../../utilities/logging';

// Types
import { NavigationInjectedProps } from 'react-navigation';
import { ApplicationState } from '../../__types__';

// Styles
import { transparent } from '../../styles/colors';
import { unit } from '../../styles/sizes';
import { useTheme, TextInput, Switch, Theme } from 'react-native-paper';
import { height } from '../../utilities/dimensions';
import { useFormStyles } from '../../styles';
import logo from '../../images/logo-big.png';

// SE Components
import { SEButton, ErrorBox, BackgroundImage, Body } from '../../components';

// Constants
import { ROUTES } from '../../constants/routes';

// Actions
import { requestLogin } from '../../redux/actions';


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

export const Login = (props: NavigationInjectedProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const formStyles = useFormStyles(theme);
    // Local Component State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [useBiometry, setUseBiometry] = useState(false);
    const [error, setError] = useState(false);
    const [touchFail, setTouchFail] = useState('');
    const [biometry, setBiometry] = useState(initialBiometry);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [activeField, setActiveField] = useState<'username' | 'password' | null>(null);

    // Redux State
    const pending = useSelector((state: ApplicationState) => state.login.pending);
    const token = useSelector((state: ApplicationState) => state.login.token);
    const failures = useSelector((state: ApplicationState) => state.login.failCount);
    const failuresChanged = useCompare(failures);
    const dispatch = useDispatch();
    // Refs
    const passField = useRef(null);

    useEffect(() => {
        // Load saved settings
        const loadSavedSettings = async () => {
            try {
                const save = await AsyncStorage.getItem('@SwingEssentials:saveUser');
                const use = await AsyncStorage.getItem('@SwingEssentials:useTouch');
                setRemember(save === 'yes');
                setUseBiometry(use === 'yes');
            } catch (err) {
                Logger.logError({
                    code: 'LGN100',
                    description: 'Failed to load stored settings.',
                    rawErrorCode: err.code,
                    rawErrorMessage: err.message,
                });
            }
        };
        loadSavedSettings();
    }, []);

    useEffect(() => {
        // Load biometric type
        const touchCheck = async () => {
            try {
                const biometricType = await TouchID.isSupported();
                setBiometry({
                    ...biometry,
                    type: biometricType === true ? 'Fingerprint' : biometricType,
                    available: true,
                });
            } catch (err) {
                setBiometry({ ...biometry, available: false });
            }
        };
        touchCheck();
    }, []);

    useEffect(() => {
        // Load stored credentials
        const loadKeychainCredentials = async () => {
            try {
                const _credentials = await Keychain.getGenericPassword();

                if (_credentials) {
                    setCredentials({
                        ...credentials,
                        stored: true,
                        savedCredentials: _credentials,
                    });
                    if (remember) {
                        setUsername(_credentials.username);
                    }
                } else {
                    setCredentials({
                        ...credentials,
                        stored: false,
                        savedCredentials: undefined,
                    });
                }
            } catch (err) {
                Logger.logError({
                    code: 'LGN200',
                    description: 'Failed to load stored credentials.',
                    rawErrorCode: err.code,
                    rawErrorMessage: err.message,
                });
            }
        };
        loadKeychainCredentials();
    }, [token, error, remember]);

    useEffect(() => {
        // handle successful login
        if (token) {
            props.navigation.pop();
        }
    }, [token, props.navigation]);

    useEffect(() => {
        // handle login failure
        if (failuresChanged) {
            setPassword('');
            if (failures > 0) {
                setCredentials({ ...credentials, stored: false });
                Keychain.resetGenericPassword();
            }
        }
    }, [failuresChanged, failures, credentials]);

    const onLogin = useCallback(
        (user, pass) => {
            if (!user || !pass) {
                setError(true);
                return;
            }
            setError(false);
            dispatch(requestLogin({ username: user, password: pass }, useBiometry));
        },
        [dispatch, useBiometry],
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
        } catch (err) {
            const label = biometry.type === 'None' ? 'Biometric authentication' : biometry.type;
            switch (err.name) {
                case 'LAErrorAuthenticationFailed':
                case 'RCTTouchIDUnknownError':
                    // authentication failed
                    setTouchFail(`Your ${label} was not recognized. Please log in using your password.`);
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
            showBiometricLogin();
        }
    }, [token, useBiometry, biometry.available, credentials.stored, showBiometricLogin]);

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.primary }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <BackgroundImage />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps={'always'}>
                {/* LOGO */}
                <View style={{ width: '100%', maxWidth: unit(500) }}>
                    <Image source={logo} resizeMethod="resize" style={styles.logo} />

                    {/* Username Field */}
                    <View>
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            editable={!pending}
                            style={activeField === 'username' || username.length > 0 ? formStyles.active : formStyles.inactive}
                            label={'Username'}
                            onFocus={() => setActiveField('username')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(val: string) => setUsername(val)}
                            onSubmitEditing={() => {
                                if (passField.current) {
                                    passField.current.focus();
                                }
                            }}
                            placeholder="Please enter your username"
                            returnKeyType={'next'}
                            underlineColorAndroid={transparent}
                            value={username}
                        />
                        {biometry.available && useBiometry && credentials.stored && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: theme.spaces.medium,
                                    bottom: 0,
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <MatIcon
                                    name={'fingerprint'}
                                    size={theme.sizes.small}
                                    color={theme.colors.text}
                                    underlayColor={transparent}
                                    onPress={() => showBiometricLogin()}
                                />
                            </View>
                        )}
                    </View>

                    {/* Password Field */}
                    <TextInput
                        autoCapitalize={'none'}
                        editable={!pending}
                        label={'Password'}
                        style={[formStyles.formField, activeField === 'password' || password.length > 0 ? formStyles.active : formStyles.inactive]}
                        onFocus={() => setActiveField('password')}
                        onBlur={() => setActiveField(null)}
                        onChangeText={(val: string) => setPassword(val)}
                        onSubmitEditing={() => onLogin(username, password)}
                        placeholder="Please enter your password"
                        ref={passField}
                        returnKeyType={'go'}
                        secureTextEntry
                        underlineColorAndroid={transparent}
                        value={password}
                    />

                    {/* Remember Me Row */}
                    <View style={[formStyles.formField, formStyles.fieldRow]}>
                        <View style={styles.toggle}>
                            <Body style={styles.toggleLabel} color={'onPrimary'}>Save Username</Body>
                            <Switch
                                value={remember}
                                style={{ backgroundColor: 'pink' }}
                                onValueChange={(val: boolean) => {
                                    setRemember(val);
                                    AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                                }}
                                ios_backgroundColor={theme.colors.light}
                                trackColor={{ false: theme.colors.onPrimary, true: theme.colors.accent }}
                            />
                        </View>
                        {biometry.available && (
                            <View style={styles.toggle}>
                                <Body color={'onPrimary'} style={[styles.toggleLabel]}>{`Use ${biometry.type}`}</Body>
                                <Switch
                                    value={useBiometry}
                                    onValueChange={(val: boolean) => {
                                        setUseBiometry(val);
                                        AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
                                    }}
                                    ios_backgroundColor={theme.colors.light}
                                    trackColor={{ false: theme.colors.onPrimary, true: theme.colors.accent }}
                                />
                            </View>
                        )}
                    </View>

                    {/* Error Messages */}
                    <ErrorBox
                        show={failures > 0 || error}
                        error={'The username / password you entered was not correct.'}
                        style={[formStyles.formField, { paddingVertical: theme.spaces.small }]}
                    />
                    <ErrorBox
                        show={touchFail.length > 0 && failures <= 0}
                        error={touchFail}
                        style={[formStyles.formField, { paddingVertical: theme.spaces.small }]}
                    />

                    {/* Log In Buttons */}
                    <View style={formStyles.fieldRow}>
                        <SEButton dark
                            title={"Sign In"}
                            loading={pending}
                            style={{ flex: 1 }}
                            onPress={() => onLogin(username, password)}
                        />
                        <SEButton
                            mode={'text'}
                            disabled={pending}
                            labelStyle={{ color: theme.colors.onPrimary }}
                            style={{ marginLeft: theme.spaces.medium, flex: 0 }}
                            title="CANCEL"
                            onPress={() => props.navigation.pop()}
                        />
                    </View>

                    {/* Registration Links */}
                    <View style={[formStyles.fieldRow]}>
                        <SEButton
                            mode={'text'}
                            labelStyle={{ color: theme.colors.onPrimary }}
                            title="Forgot Password?"
                            onPress={() => props.navigation.push(ROUTES.RESET_PASSWORD)}
                        />
                        <SEButton
                            mode={'text'}
                            labelStyle={{ color: theme.colors.onPrimary }}
                            title="Need an Account?"
                            onPress={() => props.navigation.push(ROUTES.REGISTER)}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const useStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        height: unit(60),
        width: '100%',
        resizeMode: 'contain',
        marginBottom: theme.spaces.medium,
    },
    scrollContainer: {
        minHeight: height - getStatusBarHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spaces.medium,
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    toggleLabel: {
        fontSize: theme.fontSizes[14],
        marginRight: theme.spaces.small,
    },
});
