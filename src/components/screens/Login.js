import React from 'react';
import {connect} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import {requestLogin} from '../../actions/LoginActions';
import {scale, moderateScale} from '../../styles/dimension';

import logo from '../../images/logo-big.png';

import { 
    ActivityIndicator,
    AsyncStorage,
    View, 
    ScrollView, 
    StyleSheet, 
    Image,
    Keyboard,
    Switch,
    StatusBar,
    Platform,
    Text
} from 'react-native';
//import Text from '../Text/Text';
import {FormInput, Button, Header, Icon} from 'react-native-elements';
import KeyboardView from '../Keyboard/KeyboardView';

import styles, {colors, spacing, sizes, altStyles} from '../../styles/index';


function mapStateToProps(state){
    return {
        username: state.userData.username,
        loginFails: state.login.failCount,
        token: state.login.token
    };
}
function mapDispatchToProps(dispatch){
    return {
        requestLogin: (userInfo) => dispatch(requestLogin({username:userInfo.username, password:userInfo.password}))
    }
}

class Login extends React.Component{
    constructor(props){
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

    componentWillMount () {
        StatusBar.setHidden(false);
        // read the values of the toggle options from storage
        let saveUser = false;
        let useTouch = false;
        AsyncStorage.getItem('@SwingEssentials:saveUser')
        .then((val)=>{
            saveUser = val === 'yes';
            this.setState({remember: val==='yes'});
        });
        AsyncStorage.getItem('@SwingEssentials:useTouch')
        .then((val)=>{
            useTouch = val === 'yes';
            this.setState({useTouch: val==='yes'});
        });

        // check if biometry is available
        if(Platform.OS === 'android' && Platform.Version <= 23){
            this.setState({biometry: null})
            return;
        }
        else{
            TouchID.isSupported()
            .then((biometryType) => {
                if(biometryType === 'TouchID'){this.setState({biometry: 'TouchID'});}
                else if(biometryType === 'FaceID'){this.setState({biometry: 'FaceID'});}
                else if(biometryType === true){this.setState({biometry: 'Fingerprint ID'});}
                else{
                    this.setState({biometry: null})
                    return;
                }
                this._updateKeychain(()=>{
                    if(useTouch){
                        this._showBiometricLogin();
                    }
                });
            })
            .catch((err) => {
                this._updateKeychain();
                // could not determine bio type - fallback to password
            });
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.token){
            this.setState({waiting: false});
            this.props.navigation.goBack(null);
        }
        else if(nextProps.loginFails !== this.props.loginFails){
            this.setState({password: '', waiting: false});
            this._updateKeychain();
        }
    }

    _updateKeychain(callback=null){
        Keychain.getGenericPassword()
        .then((credentials) => {
            this.setState({credentials: credentials});
            if(!credentials){ return; }
            if(this.state.remember){this.setState({username: credentials.username})}
            if(callback){callback();}
        })
        .catch((err) => {
            console.log(err);
        });
    }

    _onLogin(){
        if(!this.state.username || !this.state.password){
            this.setState({error: true});
            return;
        }
        this.setState({error: false, waiting: true});
        this.props.requestLogin({username: this.state.username, password: this.state.password});
    }

    _showBiometricLogin(){
        if(!this.state.biometry || !this.state.credentials){ return; }

        TouchID.authenticate('Secure Sign In')
        // TouchID.authenticate('to sign in as ' + this.state.credentials.username)
        .then(() => {
            this.setState({error: false, waiting: true});
            this.props.requestLogin({username: this.state.credentials.username, password: this.state.credentials.password});
        })
        .catch((err)=>{
            switch(err.name){
                
                case 'LAErrorAuthenticationFailed':
                case 'RCTTouchIDUnknownError':
                    // authentication failed
                    this.setState({touchFail: true});
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


    render(){
        return(
            <KeyboardView style={{
                    backgroundColor: colors.lightPurple, 
                    justifyContent: 'center'
                }}
                scrollStyle={{minHeight: '100%', justifyContent: 'center', alignItems: 'center'}}
            >
            <View style={{width: '100%', maxWidth: 500}}>
                <Image 
                    source={logo} 
                    resizeMethod='resize'
                    style={{height: moderateScale(50, .5), width:'100%', resizeMode: 'contain'}}
                />
                <View style={{flex: 0, marginTop: spacing.normal}}>
                    <Text style={StyleSheet.flatten([styles.formLabel, {color: colors.white}])}>Username</Text>
                    <View>
                        <FormInput
                        //autoFocus={true}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        onSubmitEditing={()=>{if(this.pass){this.pass.focus()}}}
                        returnKeyType={'next'}
                        containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                        inputStyle={styles.formInput}
                        underlineColorAndroid={colors.transparent}
                        value={this.state.username}
                        editable={!this.state.waiting}
                        placeholder="Please enter your username"
                        onChangeText={(newText) => this.setState({username: newText})}
                    />
                    {this.state.biometry && this.state.useTouch && this.state.credentials &&
                        <View style={{
                            position: 'absolute', 
                            right: spacing.small, top: 0, 
                            marginTop: spacing.small, 
                            height: sizes.normal, 
                            alignItems: 'center', 
                            justifyContent:'center'}}>
                            <Icon 
                                // type={'ionicon'}
                                name={'fingerprint'} 
                                size={sizes.mediumSmall} 
                                color={colors.purple}
                                underlayColor={colors.transparent}
                                onPress={() => this._showBiometricLogin()}
                            />
                        </View>
                    }
                </View>
                    <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, color: colors.white}])}>Password</Text>
                    <FormInput
                        ref={(ref) => this.pass = ref}
                        autoCapitalize={'none'}
                        returnKeyType={'go'}
                        onSubmitEditing={()=>{if(this.state.username && this.state.password){this._onLogin()}}}
                        containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                        inputStyle={styles.formInput}
                        underlineColorAndroid={colors.transparent}
                        value={this.state.password}
                        editable={!this.state.waiting}
                        secureTextEntry={true}
                        placeholder="Please enter your password"
                        onChangeText={(newText) => this.setState({password: newText})}
                    />
                    <View style={{marginTop: spacing.extraLarge, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap:'wrap'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{fontSize: scale(14), color: colors.white, marginRight: spacing.small}}>Save Username</Text>
                            <Switch 
                                value={this.state.remember} 
                                onValueChange={(val) => {
                                    this.setState({remember: val});
                                    AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes':'no');
                                }}
                                trackColor={colors.purple}
                                onTintColor={colors.purple}
                                //style={{transform: [{ scaleX: scale(1) }, { scaleY: scale(1) }]}}
                            />
                        </View>
                        {this.state.biometry &&
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                                <Text style={{fontSize: scale(14), color: colors.white, marginRight: spacing.small}}>{this.state.biometry}</Text>
                                <Switch 
                                    value={this.state.useTouch} 
                                    onValueChange={(val) => {
                                        this.setState({useTouch: val});
                                        AsyncStorage.setItem('@SwingEssentials:useTouch', val ? 'yes':'no');
                                    }}
                                    onTintColor={colors.purple}
                                    trackColor={colors.purple}
                                    //style={{transform: [{ scaleX: scale(1) }, { scaleY: scale(1) }]}}
                                />
                            </View>
                        }
                    </View>
                    {(this.props.loginFails > 0 || this.state.error) && 
                        <Text style={StyleSheet.flatten([styles.formValidation, {marginTop: spacing.extraLarge}])}>
                            The username/password you entered was not correct.
                        </Text>
                    }
                    {this.state.touchFail && this.props.loginFails <= 0 && 
                        <Text style={StyleSheet.flatten([styles.formValidation, {marginTop: spacing.extraLarge}])}>
                            {`Your ${this.state.biometry} was not recognized. Please enter your password to sign in.`} 
                        </Text>
                    }
                    {!this.state.waiting &&
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: spacing.extraLarge}}>
                            <Button
                                title="SIGN IN"
                                fontSize={scale(14)}
                                onPress={this._onLogin.bind(this)}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: 0, flex: 1}])}
                                containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 0}}
                            />
                            <Button 
                                color={colors.white} 
                                containerViewStyle={{marginLeft: spacing.normal, marginRight: 0, flex: 0}} 
                                buttonStyle={styles.linkButton} 
                                title="CANCEL" 
                                fontSize={scale(14)}
                                onPress={()=>this.props.navigation.goBack(null)}>
                            </Button>
                        </View>
                    }
                    {this.state.waiting &&
                        <ActivityIndicator 
                            style={{marginTop: spacing.extraLarge}} 
                            size={'large'} 
                            color={colors.white}
                        />
                    }
                    <View style={{
                            flexDirection:'row', 
                            justifyContent:'space-between',
                            marginTop: spacing.large
                        }}>
                        <Button 
                            color={colors.white} 
                            containerViewStyle={{marginLeft:0, marginRight: 0}} 
                            buttonStyle={styles.linkButton} 
                            title="Forgot Password?" 
                            fontSize={scale(14)}
                            onPress={()=>this.props.navigation.push('Forgot')}>
                        </Button>
                        <Button 
                            color={colors.white} 
                            containerViewStyle={{
                                marginLeft:0, marginRight: 0
                            }} 
                            buttonStyle={styles.linkButton} 
                            title="Create Account" 
                            fontSize={scale(14)}
                            onPress={()=>this.props.navigation.push('Register')}>
                        </Button>
                    </View>
                </View>
            </View>
            </KeyboardView>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);