import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCompare } from '../../utilities';

// Components
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { Icon, Input } from 'react-native-elements';

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
import { spaces, unit, sizes, fonts } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';
import { height } from '../../utilities/dimensions';

import logo from '../../images/logo-big.png';

// SE Components
import { SEButton, ErrorBox } from '../../components';

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
    // Local Component State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [useBiometry, setUseBiometry] = useState(false);
    const [error, setError] = useState(false);
    const [touchFail, setTouchFail] = useState('');
    const [biometry, setBiometry] = useState(initialBiometry);
    const [credentials, setCredentials] = useState(initialCredentials);

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
            }
            catch (error) {
                Logger.logError({
                    code: 'LGN100',
                    description: `Failed to load stored settings.`,
                    rawErrorCode: error.code,
                    rawErrorMessage: error.message,
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
            }
            catch(error){
                Logger.logError({
                    code: 'LGN200',
                    description: `Failed to load stored credentials.`,
                    rawErrorCode: error.code,
                    rawErrorMessage: error.message,
                });
            }
        };
        loadKeychainCredentials();
    }, [token, error, remember]);

    useEffect(() => {
        // Show biometric login on load
        if (useBiometry && biometry.available && credentials.stored) {
            showBiometricLogin();
        }
    }, [biometry.available, credentials.stored]);

    useEffect(() => {
        // handle successful login
        if (token) {
            props.navigation.pop();
        }
        if (failuresChanged) {
            setPassword('');
        }
    }, [token, failuresChanged, props.navigation]);

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
                case 'LAErrorSystemCancel':
                // user canceled touch id - fallback to password
                default:
                    break;
            }
        }
    }, [biometry, credentials, useBiometry]);

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.colors.primary[400] }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'always'}>
                {/* LOGO */}
                <View style={{ width: '100%', maxWidth: unit(500) }}>
                    <Image source={logo} resizeMethod="resize" style={styles.logo} />

                    {/* Username Field */}
                    <View>
                        <Input
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            containerStyle={{ paddingHorizontal: 0 }}
                            editable={!pending}
                            inputContainerStyle={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary[800], }]}
                            inputStyle={[styles.input, { color: theme.colors.text[500] }]}
                            label={'Username'}
                            labelStyle={[styles.formLabel, { color: theme.colors.onPrimary[50] }]}
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
                                    right: spaces.medium,
                                    bottom: 0,
                                    height: sizes.large,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Icon
                                    name={'fingerprint'}
                                    size={sizes.small}
                                    color={theme.colors.text[500]}
                                    underlayColor={transparent}
                                    onPress={() => showBiometricLogin()}
                                />
                            </View>
                        )}
                    </View>

                    {/* Password Field */}
                    <Input
                        autoCapitalize={'none'}
                        containerStyle={{ marginTop: spaces.medium, paddingHorizontal: 0 }}
                        editable={!pending}
                        inputContainerStyle={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary[800], }]}
                        inputStyle={[styles.input, { color: theme.colors.text[500] }]}
                        label={'Password'}
                        labelStyle={[styles.formLabel, { color: theme.colors.onPrimary[50] }]}
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
                    <View style={styles.rememberRow}>
                        <View style={styles.toggle}>
                            <Text style={[styles.toggleLabel, { color: theme.colors.onPrimary[50] }]}>Save Username</Text>
                            <Switch
                                value={remember}
                                onValueChange={(val: boolean) => {
                                    setRemember(val);
                                    AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                                }}
                                ios_backgroundColor={theme.colors.primary[200]}
                                trackColor={{ false: theme.colors.onPrimary[50], true: theme.colors.primary[500] }}
                            />
                        </View>
                        {biometry.available && (
                            <View style={styles.toggle}>
                                <Text style={[styles.toggleLabel, { color: theme.colors.onPrimary[50] }]}>{`Use ${biometry.type}`}</Text>
                                <Switch
                                    value={useBiometry}
                                    onValueChange={(val: boolean) => {
                                        setUseBiometry(val);
                                        AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
                                    }}
                                    ios_backgroundColor={theme.colors.primary[200]}
                                    trackColor={{ false: theme.colors.onPrimary[50], true: theme.colors.primary[500] }}
                                />
                            </View>
                        )}
                    </View>

                    {/* Error Messages */}
                    <ErrorBox
                        show={failures > 0 || error} //={(this.props.loginFails > 0 || this.state.error)}
                        error={'The username/password you entered was not correct.'}
                        style={{ marginTop: spaces.xLarge }}
                    />
                    <ErrorBox
                        show={touchFail.length > 0 && failures <= 0} //={(this.state.touchFail && this.props.loginFails <= 0)}
                        error={touchFail}
                        style={{ marginTop: spaces.xLarge }}
                    />

                    {/* Log In Buttons */}
                    {!pending && (
                        <View style={styles.loginRow}>
                            <SEButton
                                title="SIGN IN"
                                containerStyle={{ flex: 1 }}
                                onPress={() => onLogin(username, password)}
                            />
                            <SEButton
                                link
                                containerStyle={{ marginLeft: spaces.medium, flex: 0 }}
                                title="CANCEL"
                                onPress={() => props.navigation.pop()}
                            />
                        </View>
                    )}

                    {/* Loading Spinner */}
                    {pending && <ActivityIndicator style={{ marginTop: spaces.jumbo }} size={'large'} color={theme.colors.onPrimary[50]} />}

                    {/* Registration Links */}
                    <View style={styles.registerRow}>
                        <SEButton
                            link
                            title="Forgot Password?"
                            onPress={() => props.navigation.push(ROUTES.RESET_PASSWORD)}
                        />
                        <SEButton link title="Create Account" onPress={() => props.navigation.push(ROUTES.REGISTER)} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formLabel: {
        fontFamily: 'SFCompactDisplay-Regular',
        marginLeft: 0,
        marginTop: 0,
        fontSize: fonts[14],
        fontWeight: 'bold',
    },
    input: {
        fontSize: fonts[14],
        textAlignVertical: 'center',
        paddingHorizontal: spaces.small,
    },
    inputContainer: {
        height: sizes.large,
        marginTop: spaces.small,
        padding: spaces.small,
        borderWidth: unit(1),
    },
    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spaces.xLarge,
    },
    logo: {
        height: unit(60),
        width: '100%',
        resizeMode: 'contain',
        marginBottom: spaces.medium,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spaces.medium,
    },
    rememberRow: {
        marginTop: spaces.xLarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    scrollContainer: {
        minHeight: height - getStatusBarHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spaces.medium,
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    toggleLabel: {
        fontSize: fonts[14],
        marginRight: spaces.small
    },
});
