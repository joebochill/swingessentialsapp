import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, Text, Switch, ActivityIndicator } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { white, purple, black, oledBlack, transparent } from '../../../styles/colors';
import { spaces, unit, sizes, fonts } from '../../../styles/sizes';
import { SEButton, ErrorBox } from '../../../components';
import { EmptyState, wrapIcon } from '@pxblue/react-native-components';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';
import AsyncStorage from '@react-native-community/async-storage';
import logo from '../../../images/logo-big.png';

type LoginProps = NavigationInjectedProps & {}

export const Login = withNavigation((props: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [credentialsStored, setCredentialsStored] = useState(true);
    const [useBiometric, setUseBiometric] = useState(true);
    const [biometricAvailable, setUseBiometricAvailable] = useState(true);
    const [biometricType, setBiometricType] = useState('TouchID')

    return (
        <View style={styles.container}>
            {/* LOGO */}
            <Image source={logo} resizeMethod='resize' style={styles.logo} />

            {/* Username Field */}
            <View>
                <Input
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    containerStyle={{ paddingHorizontal: 0 }}
                    editable={!loading}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    label={'Username'}
                    labelStyle={[styles.formLabel, { color: white[50] }]}
                    onChangeText={(val: string) => setUsername(val)}
                    // onSubmitEditing={() => { if (this.pass) { this.pass.focus() } }}
                    placeholder="Please enter your username"
                    returnKeyType={'next'}
                    underlineColorAndroid={transparent}
                    value={username}
                />
                {biometricAvailable && useBiometric && credentialsStored &&
                    <View style={{
                        position: 'absolute',
                        right: spaces.medium,
                        bottom: 0,
                        height: sizes.large,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Icon
                            name={'fingerprint'}
                            size={sizes.small}
                            color={purple[500]}
                            underlayColor={transparent}
                        // onPress={() => this._showBiometricLogin()}
                        />
                    </View>
                }
            </View>

            {/* Password Field */}
            <Input
                autoCapitalize={'none'}
                containerStyle={{ marginTop: spaces.medium, paddingHorizontal: 0 }}
                // editable={!waiting}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                label={'Password'}
                labelStyle={[styles.formLabel, { color: white[50] }]}
                onChangeText={(val: string) => setPassword(val)}
                // onSubmitEditing={() => { if (username && password) { this._onLogin() } }}
                placeholder="Please enter your password"
                // ref={(ref) => this.pass = ref}
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
                {biometricAvailable &&
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
                }
            </View>

            {/* Error Messages */}
            <ErrorBox
                show={false}//={(this.props.loginFails > 0 || this.state.error)}
                error={'The username/password you entered was not correct.'}
            />
            <ErrorBox
                show={false}//={(this.state.touchFail && this.props.loginFails <= 0)}
                error={`Your ${'FaceID'} was not recognized. Please enter your password to sign in.`}
            />

            {/* Log In Buttons */}
            {!loading &&
                <View style={styles.loginRow}>
                    <SEButton
                        title="SIGN IN"
                        containerStyle={{ flex: 1 }}
                        onPress={async () => {
                            await AsyncStorage.setItem('userToken', 'abc');
                            props.navigation.navigate(ROUTES.APP_GROUP);
                        }}
                    />
                    <SEButton link
                        containerStyle={{ marginLeft: spaces.medium, flex: 0 }}
                        title="CANCEL"
                        onPress={() => props.navigation.goBack()}
                    />
                </View>
            }

            {/* Loading Spinner */}
            {loading &&
                <ActivityIndicator
                    style={{ marginTop: spaces.jumbo }}
                    size={'large'}
                    color={white[50]}
                />
            }

            {/* Registration Links */}
            <View style={styles.registerRow}>
                <SEButton
                    link
                    title="Forgot Password?"
                    onPress={() => props.navigation.push('Forgot')}
                />
                <SEButton
                    link
                    title="Create Account"
                    onPress={() => props.navigation.push('Register')}
                />
            </View>
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: unit(500),
        backgroundColor: purple[400],
        justifyContent: 'center',
        paddingHorizontal: spaces.medium
    },
    formLabel: {
        color: purple[500],
        marginLeft: 0,
        marginTop: 0,
        fontSize: fonts[14],
        fontWeight: 'bold'
    },
    inputContainer: {
        height: sizes.large,
        backgroundColor: white[50],
        marginTop: spaces.small,
        padding: spaces.small,
        borderColor: purple[800],
        borderWidth: unit(1)
    },
    input: {
        color: purple[500],
        fontSize: fonts[14],
        textAlignVertical: 'center',
        paddingHorizontal: spaces.small
    },
    rememberRow: {
        marginTop: spaces.xLarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spaces.xLarge
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spaces.medium
    },
    logo: {
        height: unit(50),
        width: '100%',
        resizeMode: 'contain',
        marginBottom: spaces.medium
    },
    toggleLabel: { fontSize: fonts[14], color: white[50], marginRight: spaces.small }
});