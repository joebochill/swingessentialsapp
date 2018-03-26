import React from 'react';
import {connect} from 'react-redux';
import {createAccount, checkUsernameAvailability, checkEmailAvailability} from '../../actions/RegistrationActions';

import { 
    View, 
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import {FormInput, FormLabel, FormValidationMessage, Button, Header} from 'react-native-elements';


import styles, {colors, spacing, altStyles} from '../../styles/index';
import KeyboardView from '../Keyboard/KeyboardView';

function mapStateToProps(state){
    return {
        token: state.login.token,
        emailAvailable: state.registration.emailAvailable,
        userAvailable: state.registration.userAvailable,
        registrationFailure: state.registration.registrationFailure
    };
}
function mapDispatchToProps(dispatch){
    return {
        createAccount: (data) => {dispatch(createAccount(data))},
        checkUser: (user) => {dispatch(checkUsernameAvailability(user))},
        checkEmail: (email) => {dispatch(checkEmailAvailability(email))}
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
            validationError: false
        };
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

    componentWillMount () {

    }
    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.token){
            this.props.navigation.pop();
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
            //(!this.state.phone || (this.state.phone && this.state.validPhone)) &&
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

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ 
                        backgroundColor: colors.lightPurple, 
                        height: Platform.OS === 'ios' ? 70 :  70 - 24, 
                        padding: Platform.OS === 'ios' ? 15 : 10
                    }}
                    //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
                    leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
                        onPress: () => this.props.navigation.pop()}}
                    centerComponent={{ text: 'Create Account', style: { color: colors.white, fontSize: 18 } }}
                />
                <KeyboardView fixed={
                    <View>
                        {!this.props.registrationFailure ?
                            <Button
                                title="CREATE ACCOUNT"
                                disabled={!this._validateFields() || this.props.registrationFailure}
                                onPress={()=> {this._submitRegistration()}}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                disabledStyle={styles.disabledButton}
                                containerViewStyle={styles.buttonContainer}
                            /> :
                            <FormValidationMessage 
                                containerStyle={StyleSheet.flatten([styles.formValidationContainer, {marginTop: spacing.normal}])} 
                                labelStyle={styles.formValidation}>
                                Registration Failed - try again later
                            </FormValidationMessage>
                        }
                    </View>
                }>
                    {this.regProperties.map((item,index) =>
                        <View key={'reg_field_'+index} style={{marginBottom:spacing.normal}}>
                            <FormLabel 
                                containerStyle={styles.formLabelContainer} 
                                labelStyle={StyleSheet.flatten([styles.formLabel])}>
                                {item.display}
                            </FormLabel>
                            <FormInput
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
                                <FormValidationMessage 
                                    containerStyle={StyleSheet.flatten([styles.formValidationContainer, {marginTop: spacing.normal}])} 
                                    labelStyle={styles.formValidation}>
                                    {item.errorMessage()}
                                </FormValidationMessage> 
                            }
                        </View>
                    )}
                </KeyboardView>
            </View>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);