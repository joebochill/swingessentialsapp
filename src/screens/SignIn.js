import React from 'react';

// Components
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image,
    Switch,
    StatusBar,
    Platform,
    Text
} from 'react-native';
import { Input, Icon } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import SEButton from '../components/SEButton';
import { connect } from 'react-redux';

import logo from '../images/logo-big.png';
import globalStyles, { colors, spacing, sizes } from '../styles/index';
import { scale, moderateScale } from '../styles/dimension';
import ErrorBox from '../components/ErrorBox';
import { ROUTES } from '../constants/routes';
import { LOGIN } from '../redux/actions';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false,
            waiting: false,
            touchFail: false,
            biometry: null,
            credentials: null,
            remember: false,
            useTouch: false
        };
    }

    componentDidMount() {
        StatusBar.setHidden(false);
        // read the values of the toggle options from storage
        let saveUser = false;
        let useTouch = false;
        AsyncStorage.getItem('@SwingEssentials:saveUser')
            .then((val) => {
                saveUser = val === 'yes';
                this.setState({ remember: val === 'yes' });
            });
        AsyncStorage.getItem('@SwingEssentials:useTouch')
            .then((val) => {
                useTouch = val === 'yes';
                this.setState({ useTouch: val === 'yes' });
            });

        // check if biometry is available
        if (Platform.OS === 'android' && Platform.Version <= 23) {
            this.setState({ biometry: null })
            return;
        }
        else {
            // TouchID.isSupported()
            //     .then((biometryType) => {
            //         if (biometryType === 'TouchID') { this.setState({ biometry: 'TouchID' }); }
            //         else if (biometryType === 'FaceID') { this.setState({ biometry: 'FaceID' }); }
            //         else if (biometryType === true) { this.setState({ biometry: 'Fingerprint ID' }); }
            //         else {
            //             this.setState({ biometry: null })
            //             return;
            //         }
            //         this._updateKeychain(() => {
            //             if (useTouch) {
            //                 this._showBiometricLogin();
            //             }
            //         });
            //     })
            //     .catch((err) => {
            //         this._updateKeychain();
            //         // could not determine bio type - fallback to password
            //     });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.token && !prevProps.token) {
            this.setState({ waiting: false });
            this.props.navigation.navigate(ROUTES.HOME);
            //this.props.navigation.goBack(null);
        }
        else if (this.props.loginFails !== prevProps.loginFails) {
            this.setState({ password: '', waiting: false });
            //this._updateKeychain();
        }
    }

    render() {
        const { navigation } = this.props;
        const { username, password, waiting } = this.state;
        return (
            <KeyboardAvoidingView style={{
                backgroundColor: colors.lightPurple,
                justifyContent: 'center'
            }}
                scrollStyle={styles.scroll}
            >
                <View style={styles.primaryView}>
                    {/* Logo */}
                    <View style={styles.logoView}>
                        <Image
                            source={logo}
                            resizeMethod='resize'
                            style={styles.logoImage}
                        />
                    </View>

                    {/* Username */}
                    <View>
                        <Input
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            containerStyle={{ paddingHorizontal: 0 }}
                            editable={!waiting}
                            inputContainerStyle={globalStyles.inputContainerStyle}
                            inputStyle={globalStyles.inputStyle}
                            label={'Username'}
                            labelStyle={StyleSheet.flatten([globalStyles.formLabel, { color: colors.white }])}
                            onChangeText={(val) => this.setState({ username: val })}
                            onSubmitEditing={() => { if (this.pass) { this.pass.focus() } }}
                            placeholder="Please enter your username"
                            returnKeyType={'next'}
                            underlineColorAndroid={colors.transparent}
                            value={username}
                        />
                        {this.state.biometry && this.state.useTouch && this.state.credentials &&
                            <View style={{
                                position: 'absolute',
                                right: spacing.small,
                                bottom: 0,
                                // marginTop: spacing.small,
                                height: sizes.normal,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon
                                    name={'fingerprint'}
                                    size={sizes.mediumSmall}
                                    color={colors.purple}
                                    underlayColor={colors.transparent}
                                // onPress={() => this._showBiometricLogin()}
                                />
                            </View>
                        }
                    </View>

                    {/* Password */}
                    <Input
                        autoCapitalize={'none'}
                        containerStyle={{ marginTop: spacing.small, paddingHorizontal: 0 }}
                        editable={!waiting}
                        inputContainerStyle={globalStyles.inputContainerStyle}
                        inputStyle={globalStyles.inputStyle}
                        label={'Password'}
                        labelStyle={StyleSheet.flatten([globalStyles.formLabel, { color: colors.white }])}
                        onChangeText={(val) => this.setState({ password: val })}
                        onSubmitEditing={() => { if (username && password) { this._onLogin() } }}
                        placeholder="Please enter your password"
                        ref={(ref) => this.pass = ref}
                        returnKeyType={'go'}
                        secureTextEntry
                        underlineColorAndroid={colors.transparent}
                        value={password}
                    />

                    {/* Remember Me Row */}
                    <View style={styles.rememberRow}>
                        <View style={styles.toggle}>
                            <Text style={{ fontSize: scale(14), color: colors.white, marginRight: spacing.small }}>Save Username</Text>
                            <Switch
                                value={this.state.remember}
                                onValueChange={(val) => {
                                    this.setState({ remember: val });
                                    AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes' : 'no');
                                }}
                                trackColor={{ false: colors.white, true: colors.purple }}
                            />
                        </View>
                        {this.state.biometry &&
                            <View style={styles.toggle}>
                                <Text style={{ fontSize: scale(14), color: colors.white, marginRight: spacing.small }}>{this.state.biometry}</Text>
                                <Switch
                                    value={this.state.useTouch}
                                    onValueChange={(val) => {
                                        this.setState({ useTouch: val });
                                        AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes' : 'no');
                                    }}
                                    trackColor={{ false: colors.white, true: colors.purple }}
                                />
                            </View>
                        }
                    </View>

                    {/* Error Messages */}
                    <ErrorBox
                        show={(this.props.loginFails > 0 || this.state.error)}
                        error={'The username/password you entered was not correct.'}
                    />
                    <ErrorBox
                        show={(this.state.touchFail && this.props.loginFails <= 0)}
                        error={`Your ${this.state.biometry} was not recognized. Please enter your password to sign in.`}
                    />

                    {/* Log In Buttons */}
                    {!this.state.waiting &&
                        <View style={styles.loginRow}>
                            <SEButton
                                title="SIGN IN"
                                containerStyle={{ flex: 1 }}
                                onPress={this._onLogin.bind(this)}
                                buttonStyle={{ marginTop: 0, flex: 1 }}
                            />
                            <SEButton
                                link
                                color={colors.white}
                                containerStyle={{ marginLeft: spacing.normal, marginRight: 0, flex: 0 }}
                                title="CANCEL"
                                onPress={() => this.props.navigation.goBack(null)}
                            />
                        </View>
                    }

                    {/* Loading Spinner */}
                    {this.state.waiting &&
                        <ActivityIndicator
                            style={{ marginTop: spacing.extraLarge }}
                            size={'large'}
                            color={colors.white}
                        />
                    }

                    {/* Registration */}
                    <View style={styles.registerRow}>
                        <SEButton
                            color={colors.white}
                            link
                            title="Forgot Password?"
                            onPress={() => this.props.navigation.push('Forgot')}
                        />
                        <SEButton
                            color={colors.white}
                            link
                            title="Create Account"
                            onPress={() => this.props.navigation.push('Register')}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }

    _updateKeychain(callback = null) {
        Keychain.getGenericPassword()
            .then((credentials) => {
                this.setState({ credentials: credentials });
                if (!credentials) { return; }
                if (this.state.remember) { this.setState({ username: credentials.username }) }
                if (callback) { callback(); }
            })
            .catch((err) => {
                logLocalError('128: Keychain Error: ' + err.toString());
            });
    }

    _onLogin() {
        if (!this.state.username || !this.state.password) {
            this.setState({ error: true });
            return;
        }
        this.setState({ error: false, waiting: true });
        this.props.login({ username: this.state.username, password: this.state.password });
        
        // this.props.navigation.navigate(ROUTES.APP);
    }

    _showBiometricLogin() {
        if (!this.state.biometry || !this.state.credentials) { return; }

        TouchID.authenticate('Secure Sign In')
            // TouchID.authenticate('to sign in as ' + this.state.credentials.username)
            .then(() => {
                this.setState({ error: false, waiting: true });
                this.props.requestLogin({ username: this.state.credentials.username, password: this.state.credentials.password });
            })
            .catch((err) => {
                switch (err.name) {

                    case 'LAErrorAuthenticationFailed':
                    case 'RCTTouchIDUnknownError':
                        // authentication failed
                        this.setState({ touchFail: true });
                        break;
                    case 'LAErrorUserCancel':
                    case 'LAErrorUserFallback':
                    case 'LAErrorSystemCancel':
                    // user canceled touch id - fallback to password
                    case 'LAErrorPasscodeNotSet':
                    case 'LAErrorTouchIDNotAvailable':
                    case 'LAErrorTouchIDNotEnrolled':
                    case 'RCTTouchIDNotSupported':
                    // Do nothing, TouchID is unavailable - fallback to password 
                    default:
                        break;
                }
            });
    }
}

const styles = StyleSheet.create({
    scroll: {
        minHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoView: {
        height: 75,
        width: '100%',
        marginBottom: 5
    },
    logoImage: {
        height: moderateScale(50, .5),
        width: '100%',
        resizeMode: 'contain'
    },
    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.extraLarge
    },
    primaryView: {
        width: '100%',
        maxWidth: 500
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.large
    },
    rememberRow: {
        marginTop: spacing.extraLarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});


function mapStateToProps(state) {
    return {
        // username: state.userData.username,
        loginFails: state.login.failCount,
        token: state.login.token
    };
}
function mapDispatchToProps(dispatch) {
    return {
        login: (userInfo) => dispatch({type: LOGIN.REQUEST, payload:{
            username: userInfo.username,
            password: userInfo.password
        }})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);