import React from 'react';
import {connect} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import {requestLogin} from '../../actions/LoginActions';

import logo from '../../images/logo-big.png';

import { 
    ActivityIndicator,
    AsyncStorage,
    View, 
    ScrollView, 
    StyleSheet, 
    Animated,
    Keyboard,
    Platform,
    Switch,
    Text
} from 'react-native';
import {FormInput, FormLabel, FormValidationMessage, Button, Header, Icon} from 'react-native-elements';

import styles, {colors, spacing, sizes, altStyles} from '../../styles/index';


function mapStateToProps(state){
    return {
        username: state.userData.username,
        loginFails: state.login.failCount,
        token: state.login.token,
        loggedOut: state.login.loggedOut
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
            remember: false
        };
        this.keyboardHeight = new Animated.Value(spacing.normal);
        this.imageHeight = new Animated.Value(100);
    }
    componentDidMount(){
        AsyncStorage.getItem('@SwingEssentials:saveUser')
        .then((val)=>{
            this.setState({remember: val==='yes'});

            Keychain.getGenericPassword()
            .then((credentials) => {
                if(!credentials){return;}
                if(val==='yes'){this.setState({username: credentials.username})}
                this.setState({credentials: credentials});
                
                TouchID.isSupported()
                .then((biometryType) => {
                    if(biometryType === 'TouchID'){this.setState({biometry: 'TouchID'});}
                    else if(biometryType === 'FaceID'){this.setState({biometry: 'FaceID'});}
                    else if(biometryType === true){this.setState({biometry: 'Fingerprint ID'});}
                    else{
                        this.setState({biometry: null})
                        return;
                    }
                    if(!this.props.loggedOut){
                        this._showBiometricLogin();
                    }
                })
                .catch((err) => {
                    // could not determine bio type - fallback to password
                });
            })
        });        
    }
    componentWillMount () {
        if(Platform.OS === 'ios'){
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        }
        else{
            this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }
    componentWillUnmount() {
        if(Platform.OS === 'ios'){
            this.keyboardWillShowSub.remove();
            this.keyboardWillHideSub.remove();
        }
        else{
            this.keyboardDidShowSub.remove();
            this.keyboardDidHideSub.remove();
        }
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.token){
            this.setState({waiting: false});
            this.props.navigation.navigate('Lessons');
        }
        else if(nextProps.loginFails !== this.props.loginFails){
            this.setState({password: '', waiting: false});
        }
    }

    // TODO: Add android event names (DidShow, DidHide)
    //https://medium.freecodecamp.org/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580
    keyboardWillShow = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration || 0,
            toValue: event.endCoordinates.height+spacing.normal,
          }),
          Animated.timing(this.imageHeight, {
            duration: event.duration || 0,
            toValue: 50,
          }),
        ]).start();
    };
    keyboardDidShow = (event) => {
        //this.keyboardHeight = event.endCoordinates.height+spacing.normal;
        this.imageHeight = 50;
        this.forceUpdate();
    }
    
    keyboardWillHide = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration || 0,
            toValue: spacing.normal,
          }),
          Animated.timing(this.imageHeight, {
            duration: event.duration || 0,
            toValue: 100,
          }),
        ]).start();
    };
    keyboardDidHide = () => {
        //this.keyboardHeight = spacing.normal;
        this.imageHeight = 100;
        this.forceUpdate();
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
            <Animated.View style={{
                flex: 1, 
                backgroundColor: colors.lightPurple, 
                
                paddingRight: spacing.normal, 
                paddingTop: spacing.normal, 
                paddingLeft: spacing.normal, 
                paddingBottom: this.keyboardHeight}}>
                <ScrollView contentContainerStyle={{flex: 1, alignItems: 'stretch', justifyContent:'center'}}>
                    <Animated.Image 
                        source={logo} 
                        resizeMethod='resize'
                        style={{height: this.imageHeight, width:'100%', resizeMode: 'contain'}}
                    />
                    <View style={{flex: 0, marginTop: spacing.normal}}>
                    <FormLabel 
                        containerStyle={styles.formLabelContainer} 
                        labelStyle={StyleSheet.flatten([styles.formLabel, {color: colors.white}])}>Username</FormLabel>
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
                    {this.state.biometry && 
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
                    <FormLabel 
                        containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal}])}
                        labelStyle={StyleSheet.flatten([styles.formLabel, {color: colors.white}])}>Password</FormLabel>
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
                    <View style={{marginTop: spacing.normal, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                        <Text style={{color: colors.white, marginRight: spacing.small}}>Save Username</Text>
                        <Switch 
                            value={this.state.remember} 
                            onValueChange={(val) => {
                                this.setState({remember: val});
                                AsyncStorage.setItem('@SwingEssentials:saveUser', val ? 'yes':'no');
                            }}
                            onTintColor={colors.purple}
                        />
                        
                    </View>
                    {(this.props.loginFails > 0 || this.state.error) && 
                        <FormValidationMessage 
                            containerStyle={styles.formValidationContainer} 
                            labelStyle={styles.formValidation}>
                            The username/password you entered was not correct.
                        </FormValidationMessage>
                    }
                    {this.state.touchFail && this.props.loginFails <= 0 && 
                        <FormValidationMessage 
                            containerStyle={styles.formValidationContainer} 
                            labelStyle={styles.formValidation}>
                            {`Your ${this.state.biometry} was not recognized. Please enter your password to sign in.`} 
                        </FormValidationMessage>
                    }
                    {!this.state.waiting &&
                        <Button
                            title="SIGN IN"
                            onPress={this._onLogin.bind(this)}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
                            containerViewStyle={styles.buttonContainer}
                        />
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
                            onPress={()=>this.props.navigation.push('Forgot')}>
                        </Button>
                        <Button 
                            color={colors.white} 
                            containerViewStyle={{
                                marginLeft:0, marginRight: 0
                            }} 
                            buttonStyle={styles.linkButton} 
                            title="Create Account" 
                            onPress={()=>this.props.navigation.push('Register')}>
                        </Button>
                    </View>
                    </View>
                </ScrollView>
            </Animated.View>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);