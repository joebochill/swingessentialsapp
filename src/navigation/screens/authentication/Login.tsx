import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, StyleSheet, Switch, Text, View } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
// Utilities
import AsyncStorage from '@react-native-community/async-storage';
import { useCompare } from '../../../utilities/hooks';
// Styles
import { white, purple, transparent } from '../../../styles/colors';
import { spaces, unit, sizes, fonts } from '../../../styles/sizes';
import logo from '../../../images/logo-big.png';
// SE Components
import { SEButton, ErrorBox } from '../../../components';
// Actions
import { requestLogin } from '../../../redux/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { ROUTES } from '../../../constants/routes';

export const Login = withNavigation((props: NavigationInjectedProps) => {
    // Local Component State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(false);
    const [touchFail] = useState(false);
    const [credentialsStored] = useState(true);
    const [useBiometric, setUseBiometric] = useState(true);
    const [biometricAvailable] = useState(true);
    const [biometricType] = useState('TouchID');
    // Redux State
    const pending = useSelector(state => state.login.pending);
    const token = useSelector(state => state.login.token);
    const failures = useSelector(state => state.login.failCount);
    const failuresChanged = useCompare(failures);
    const dispatch = useDispatch();
    // Refs
    const passField = useRef(null);

    const onLogin = useCallback(
        (username, password) => {
            if (!username || !password) {
                setError(true);
                return;
            }
            setError(false);
            dispatch(requestLogin({ username, password }));
        },
        [dispatch],
    );

    useEffect(() => {
        if (token) {
            props.navigation.pop();
        }
        if (failuresChanged) {
            setPassword('');
        }
    }, [token, failuresChanged, props.navigation]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                keyboardShouldPersistTaps={'always'}
            >
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
                    {biometricAvailable && useBiometric && credentialsStored && (
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
                                // onPress={() => this._showBiometricLogin()}
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
                    {biometricAvailable && (
                        <View style={styles.toggle}>
                            <Text style={styles.toggleLabel}>{`Use ${biometricType}`}</Text>
                            <Switch
                                value={useBiometric}
                                onValueChange={(val: boolean) => {
                                    setUseBiometric(val);
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
                />
                <ErrorBox
                    show={touchFail && failures <= 0} //={(this.state.touchFail && this.props.loginFails <= 0)}
                    error={`Your ${'FaceID'} was not recognized. Please enter your password to sign in.`}
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
                    <SEButton link title="Forgot Password?" onPress={() => props.navigation.push(ROUTES.RESET_PASSWORD)} />
                    <SEButton link title="Create Account" onPress={() => props.navigation.push(ROUTES.REGISTER)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: unit(500),
        backgroundColor: purple[400],
        paddingHorizontal: spaces.medium,
    },
    formLabel: {
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
