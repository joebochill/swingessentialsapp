import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { 
    ActivityIndicator, 
    Image, 
    KeyboardAvoidingView, 
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
import { useCompare } from '../../utilities';

// Types
import { NavigationInjectedProps } from 'react-navigation';

// Styles
import { white, purple, transparent } from '../../styles/colors';
import {spaces, unit, sizes, fonts } from '../../styles/sizes';
import logo from '../../images/logo-big.png';

// SE Components
import { SEButton, ErrorBox } from '../../components';

// Actions
import { requestLogin } from '../../redux/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { ROUTES } from '../../constants/routes';
import { ApplicationState } from '../../__types__';

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
            const save = await AsyncStorage.getItem('@SwingEssentials:saveUser');
            const use = await AsyncStorage.getItem('@SwingEssentials:useTouch');
            setRemember(save === 'yes');
            setUseBiometry(use === 'yes');
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
            const _credentials = await Keychain.getGenericPassword();
            if (_credentials) {
                setCredentials({
                    ...credentials,
                    stored: true,
                    savedCredentials: _credentials,
                });
            } else {
                setCredentials({
                    ...credentials,
                    stored: false,
                    savedCredentials: undefined,
                });
            }
        };
        loadKeychainCredentials();
    }, [token, error]);

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
            dispatch(requestLogin({ username: user, password: pass }));
        },
        [dispatch],
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
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'always'}>
                {/* LOGO */}
                <Image source={logo} resizeMethod="resize" style={styles.logo} />

                {/* Username Field */}
                <View>
                    <Input
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        containerStyle={{ paddingHorizontal: 0 }}
                        editable={!pending}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        label={'Username'}
                        labelStyle={[styles.formLabel, { color: white[50] }]}
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
                                color={purple[500]}
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
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    label={'Password'}
                    labelStyle={[styles.formLabel, { color: white[50] }]}
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
                        <Text style={styles.toggleLabel}>Save Username</Text>
                        <Switch
                            value={remember}
                            onValueChange={(val: boolean) => {
                                setRemember(val);
                                AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                            }}
                            ios_backgroundColor={purple[200]}
                            trackColor={{ false: white[50], true: purple[500] }}
                        />
                    </View>
                    {biometry.available && (
                        <View style={styles.toggle}>
                            <Text style={styles.toggleLabel}>{`Use ${biometry.type}`}</Text>
                            <Switch
                                value={useBiometry}
                                onValueChange={(val: boolean) => {
                                    setUseBiometry(val);
                                    AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
                                }}
                                ios_backgroundColor={purple[200]}
                                trackColor={{ false: white[50], true: purple[500] }}
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
                {pending && <ActivityIndicator style={{ marginTop: spaces.jumbo }} size={'large'} color={white[50]} />}

                {/* Registration Links */}
                <View style={styles.registerRow}>
                    <SEButton
                        link
                        title="Forgot Password?"
                        onPress={() => props.navigation.push(ROUTES.RESET_PASSWORD)}
                    />
                    <SEButton link title="Create Account" onPress={() => props.navigation.push(ROUTES.REGISTER)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: unit(500),
        backgroundColor: purple[400],
        paddingHorizontal: spaces.medium,
    },
    formLabel: {
        fontFamily: 'SFCompactDisplay-Regular',
        color: purple[500],
        marginLeft: 0,
        marginTop: 0,
        fontSize: fonts[14],
        fontWeight: 'bold',
    },
    input: {
        color: purple[500],
        fontSize: fonts[14],
        textAlignVertical: 'center',
        paddingHorizontal: spaces.small,
    },
    inputContainer: {
        height: sizes.large,
        backgroundColor: white[50],
        marginTop: spaces.small,
        padding: spaces.small,
        borderColor: purple[800],
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
        flex: 1,
        justifyContent: 'center',
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    toggleLabel: { fontSize: fonts[14], color: white[50], marginRight: spaces.small },
});