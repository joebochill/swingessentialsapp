import React from 'react';
import {connect} from 'react-redux';
import {requestReset} from '../../actions/RegistrationActions';

import { 
    View, 
    Text,
    ScrollView, 
    StyleSheet
} from 'react-native';
import {FormInput, Button} from 'react-native-elements';
import Header from '../Header/Header';


import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import KeyboardView from '../Keyboard/KeyboardView';

function mapStateToProps(state){
    return {

    };
}
function mapDispatchToProps(dispatch){
    return {
        requestReset: (email) => dispatch(requestReset({email:email}))
    }
}

class Forgot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            resetSent: false
        };
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header title={'Reset Password'} navigation={this.props.navigation} type={'back'}/>
                <KeyboardView 
                    fixed={!this.state.resetSent &&
                        <Button
                            title="SEND INSTRUCTIONS"
                            fontSize={scale(14)}
                            disabled={!this.state.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)}
                            onPress={()=> {this.props.requestReset(this.state.email); this.setState({resetSent: true})}}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                            disabledStyle={styles.disabledButton}
                            containerViewStyle={styles.buttonContainer}
                        />
                    }
                >
                    {!this.state.resetSent && 
                        <ScrollView>
                            <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: spacing.normal}])}>Enter your email address below and we will send you instructions for resetting your password.</Text>
                            <Text style={styles.formLabel}>Email Address</Text>
                            <FormInput
                                autoCapitalize={'none'}
                                autoFocus={true}
                                containerStyle={StyleSheet.flatten([styles.formInputContainer, {marginTop: spacing.small}])}
                                inputStyle={styles.formInput}
                                underlineColorAndroid={colors.transparent}
                                value={this.state.email}
                                keyboardType={'email-address'}
                                placeholder="Please enter your email"
                                onChangeText={(newText) => this.setState({email: newText})}
                            />
                        </ScrollView>
                    }
                    {this.state.resetSent &&
                        <ScrollView>
                            <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: spacing.normal}])}>Your password reset request was received. Check your email for further instructions.</Text>
                        </ScrollView>
                    }
                </KeyboardView>
            </View>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);