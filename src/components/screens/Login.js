import React from 'react';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {requestLogin} from '../../actions/LoginActions';

import logo from '../../images/logo-big.png';

import { 
    View, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    ScrollView, 
    StyleSheet, 
    TouchableHighlight,
    Image,
    Animated,
    Keyboard 
} from 'react-native';
import {FormInput, FormLabel, FormValidationMessage, Button, Header} from 'react-native-elements';


import styles, {colors, spacing, altStyles} from '../../styles/index';


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
            error: false
        };
        this.keyboardHeight = new Animated.Value(spacing.normal);
        this.imageHeight = new Animated.Value(100);
    }

    componentWillMount () {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.token){
            this.props.navigation.navigate('Lessons');
        }
        else{
            this.setState({password: ''});
        }
    }

    // TODO: Add android event names (DidShow, DidHide)
    //https://medium.freecodecamp.org/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580
    keyboardWillShow = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height+spacing.normal,
          }),
          Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: 50,
          }),
        ]).start();
      };
    
      keyboardWillHide = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration,
            toValue: spacing.normal,
          }),
          Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: 100,
          }),
        ]).start();
      };

    _onLogin(){
        if(!this.state.username || !this.state.password){
            this.setState({error: true});
            return;
        }
        this.setState({error: false});
        this.props.requestLogin({username: this.state.username, password: this.state.password});
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
                    <FormInput
                        containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                        inputStyle={styles.formInput}
                        underlineColorAndroid={colors.transparent}
                        value={this.state.username}
                        placeholder="Please enter your username"
                        onChangeText={(newText) => this.setState({username: newText})}
                    />
                    <FormLabel 
                        containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal}])}
                        labelStyle={StyleSheet.flatten([styles.formLabel, {color: colors.white}])}>Password</FormLabel>
                    <FormInput
                        containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                        inputStyle={styles.formInput}
                        underlineColorAndroid={colors.transparent}
                        value={this.state.password}
                        secureTextEntry={true}
                        placeholder="Please enter your password"
                        onChangeText={(newText) => this.setState({password: newText})}
                    />
                    {(this.props.loginFails > 0 || this.state.error) && 
                        <FormValidationMessage 
                            containerStyle={styles.formValidationContainer} 
                            labelStyle={styles.formValidation}>
                            The username/password you entered was not correct.
                        </FormValidationMessage>
                    }
                    <Button
                        title="SIGN IN"
                        // disabled={!this.state.username || !this.state.password}
                        // disabledStyle={styles.disabledButtonAlt}
                        onPress={this._onLogin.bind(this)}
                        buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
                        containerViewStyle={styles.buttonContainer}
                    />
                    <View style={{
                            flexDirection:'row', 
                            justifyContent:'space-between',
                            marginTop: spacing.extraLarge
                        }}>
                        <Button color={colors.white} containerViewStyle={{marginLeft:0, marginRight: 0}} buttonStyle={styles.linkButton} title="Forgot Password?" onPress={()=>alert('clicked')}></Button>
                        <Button color={colors.white} containerViewStyle={{marginLeft:0, marginRight: 0}} buttonStyle={styles.linkButton} title="Create Account" onPress={()=>alert('clicked')}></Button>
                    </View>
                    </View>
                </ScrollView>
            </Animated.View>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);