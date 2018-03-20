import React from 'react';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {requestReset} from '../../actions/RegistrationActions';

import { 
    View, 
    Text,
    ScrollView, 
    StyleSheet
} from 'react-native';
import {FormInput, FormLabel, Button, Header} from 'react-native-elements';


import styles, {colors, spacing, altStyles} from '../../styles/index';
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
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ backgroundColor: colors.lightPurple}}
                    leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
                        onPress: () => this.props.navigation.pop()}}//this.props.navigation.dispatch(NavigationActions.back({key:this.props.navigation.state.key})) }}
                    centerComponent={{ text: 'Reset Password', style: { color: colors.white, fontSize: 18 } }}
                />
                <KeyboardView 
                    fixed={!this.state.resetSent &&
                        <Button
                            title="SEND INSTRUCTIONS"
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
                            <FormLabel 
                                containerStyle={styles.formLabelContainer} 
                                labelStyle={StyleSheet.flatten([styles.formLabel])}>Email Address</FormLabel>
                            <FormInput
                                autoCapitalize={'none'}
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