import React from 'react';
import {connect} from 'react-redux';
import {createAccount, checkUsernameAvailability, checkEmailAvailability} from '../../actions/RegistrationActions';

import { 
    View, 
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {FormInput, Button} from 'react-native-elements';
import Header from '../Header/Header';


import {verifyEmail} from '../../actions/RegistrationActions';
import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import KeyboardView from '../Keyboard/KeyboardView';

function mapStateToProps(state){
    return {
        token: state.login.token,
        emailAvailable: state.registration.emailAvailable,
        userAvailable: state.registration.userAvailable,
        registrationFailure: state.registration.registrationFailure,
        pendingRegistration: state.registration.pendingRegistration,
        registrationActivated: state.registration.registrationActivated,
        registrationError: state.registration.registrationError,
        links: state.links
    };
}
function mapDispatchToProps(dispatch){
    return {
        createAccount: (data) => {dispatch(createAccount(data))},
        checkUser: (user) => {dispatch(checkUsernameAvailability(user))},
        checkEmail: (email) => {dispatch(checkEmailAvailability(email))},
        verifyEmail: (code) => {dispatch(verifyEmail(code))}
    }
}

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
            passwordConfirm: '',
            passwordsMatch: true,
            validEmail: true,
            userFocus: false,
            emailFocus: false,
            validPhone: true,
            validationError: false,
            regCode: null
        };

        // Check if we are coming from a deep link
        const code = this.props.navigation.getParam('code', null);
        if(code){
            this.state.regCode = code;
            this.props.verifyEmail(code);
        }

        this.fields = [];
        this.regProperties=[
            {property: 'firstName', display: 'First Name', blur: null,
                change: (value) => {this.setState({firstName: value.replace(/[^A-Z- .]/gi,"").substr(0,32)})}
            },
            {property: 'lastName', display: 'Last Name', blur: null,
                change: (value) => {this.setState({lastName: value.replace(/[^A-Z- .]/gi,"").substr(0,32)})}
            },
            //{property: 'phone', display: 'Phone', blur: null},
            {property: 'email', display: 'Email Address', 
                blur: ()=>{this._validateEmail()},
                error: () => (!this.props.emailAvailable || (this.state.email!=='' && !this.state.validEmail)),
                errorMessage: () => !this.props.emailAvailable ? 'Email Address is already registered' : 'Invalid Email',
                change: (value) => {this.setState({email: value.substr(0,128)}); this._validateEmail(value.substr(0,128));}
            },
            {property: 'username', display: 'Username', 
                blur: () => {this._validateUser()},
                error: () => !this.props.userAvailable,
                errorMessage: () => 'Username is already registered',
                change: (value)=> {this.setState({username: value.replace(/[^A-Z0-9-_.$#@!+]/gi,"").substr(0,32)})}
            },
            {property: 'password', display: 'Password', 
                blur: ()=>this._checkPasswords(),
                change: (value) => {this.setState({password: value}); this._checkPasswords(value, null);}
            },
            {property: 'passwordConfirm', display: 'Confirm Password', 
                blur: ()=>this._checkPasswords(),
                error: () => !this.state.passwordsMatch,
                errorMessage: () => 'Passwords don\'t match',
                change: (value) => {this.setState({passwordConfirm: value}); this._checkPasswords(null, value);}
            }
        ];
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.token && nextProps.token !== this.props.token){
            this.props.navigation.goBack(null);
        }
    }
    _validateUser(){
        if(this.state.username){
            this.props.checkUser(this.state.username);
        }
    }
    _validateEmail(mail = null){
        let email = mail || this.state.email;
        if(!email){return;}
        if(!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)){
            this.setState({validEmail: false});
        }
        else{
            this.setState({validEmail: true});
        }
        if(!mail){this.props.checkEmail(email);}
    }
    _validateFields(){
        return(
            this.state.username && this.props.userAvailable &&
            this.state.firstName && 
            this.state.lastName && 
            this.state.email && this.state.validEmail && this.props.emailAvailable &&
            this.state.password && 
            this.state.password === this.state.passwordConfirm);
    }
    
    _checkPasswords(pass=null,conf=null){
        pass = pass || this.state.password;
        conf = conf || this.state.passwordConfirm;

        if(pass && conf && pass !== conf){
            this.setState({passwordsMatch: false});
        }
        else{
            this.setState({passwordsMatch: true});
        }
    }
    _submitRegistration(){
        if(!this._validateFields()){
            this.setState({validationError: true});
            return;
        }
        else{
            this.setState({validationError: false});
            this.props.createAccount({
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phone: this.state.phone,
                password: this.state.password
            });
        }
    }

    _getRegistrationErrorMessage(code){
        switch(code){
            case 400302:
                return 'Oops! Your verification link is invalid. Please check your registration email and try again. If you continue to have problems, please contact us.';
            case 400303:
                return 'Your verification link has expired. You will need to re-register.';
            case 400304:
                return 'Your your email address has already been verified. Sign in to view your account.';
            default:
                return 'Unknown Error: ' + code;
        }
    }

    render(){
        let regError = this.props.registrationError;
        return(
            <View style={{flex: 1}}>
                <Header title={'Create Account'} navigation={this.props.navigation} type={'back'}/>
                {this.state.regCode && 
                    <KeyboardView
                        fixed={true ?//((this.props.registrationActivated && !regError) || regError === 400304) ? 
                            <Button
                                title="SIGN IN"
                                fontSize={scale(14)}
                                onPress={()=> {this.props.navigation.pop()}}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                containerViewStyle={styles.buttonContainer}
                            />
                        : null}
                    >
                        <View>
                            {this.props.pendingRegistration &&
                                <View>
                                    <ActivityIndicator color={colors.purple}/>
                                    <Text style={{fontSize: scale(14), marginTop: spacing.tiny, color: colors.purple, textAlign: 'center', width: '100%'}}>
                                        {'Checking Verification Code...'}
                                    </Text>
                                </View>
                            }
                            {this.props.registrationActivated && !regError &&
                                <Text style={{fontSize: scale(14), color: colors.purple, textAlign: 'center', width: '100%'}}>
                                    Your email address has been confirmed. Please sign in to view your account.
                                </Text>
                            }
                            {regError !== null && regError !== '' &&
                                <Text style={{fontSize: scale(14), color: colors.purple, textAlign: 'center', width: '100%'}}>
                                    {this._getRegistrationErrorMessage(regError)}
                                </Text>
                            }
                        </View>
                    </KeyboardView>
                }
                {!this.state.regCode && 
                    <KeyboardView fixed={
                        <View>
                            {!this.props.registrationFailure ?
                                <Button
                                    title="CREATE ACCOUNT"
                                    fontSize={scale(14)}
                                    disabled={!this._validateFields() || this.props.registrationFailure}
                                    onPress={()=> {this._submitRegistration()}}
                                    buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                    disabledStyle={styles.disabledButton}
                                    containerViewStyle={styles.buttonContainer}
                                /> :
                                <Text style={StyleSheet.flatten([styles.formValidation, {marginTop: spacing.normal}])}>
                                    Registration Failed - try again later
                                </Text>
                            }
                        </View>
                    }>
                        {this.regProperties.map((item,index) =>
                            <View key={'reg_field_'+index} style={{marginBottom:spacing.normal}}>
                                <Text style={styles.formLabel}>{item.display}</Text>
                                <FormInput
                                    ref={(ref) => this.fields[index] = ref}
                                    autoFocus={index===0}
                                    onSubmitEditing={()=>{
                                        if(this.fields[index+1]){
                                            this.fields[index+1].focus()
                                        }
                                        else if(this._validateFields()){ 
                                            this._submitRegistration();
                                        }
                                    }}
                                    returnKeyType={index < this.regProperties.length -1 ? 'next' : 'go'}
                                    autoCapitalize={'none'}
                                    containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                                    inputStyle={styles.formInput}
                                    underlineColorAndroid={colors.transparent}
                                    value={this.state[item.property]}
                                    keyboardType={item.property==='email'?'email-address':'default'}
                                    secureTextEntry={item.property==='password' || item.property ==='passwordConfirm'}
                                    onChangeText={item.change}
                                    onBlur={item.blur}
                                />
                                {item.error && item.error() && !this.state.validationError && 
                                    <Text style={StyleSheet.flatten([styles.formValidation, {marginTop: spacing.normal}])}>
                                        {item.errorMessage()}
                                    </Text> 
                                }
                            </View>
                        )}
                    </KeyboardView>
                }
            </View>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);