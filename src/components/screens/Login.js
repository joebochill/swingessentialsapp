import React from 'react';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {requestLogin} from '../../actions/LoginActions';

import logo from '../../images/logo-big.png';

import { 
    View, 
    ScrollView, 
    StyleSheet, 
    Animated,
    Keyboard,
    Platform
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
        this.keyboardHeight = event.endCoordinates.height+spacing.normal;
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
        this.keyboardHeight = spacing.normal;
        this.imageHeight = 100;
        this.forceUpdate();
    }

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