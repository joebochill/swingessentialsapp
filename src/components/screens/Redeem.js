import React from 'react';
import {connect} from 'react-redux';

import {Image, Text, View, ScrollView, StyleSheet} from 'react-native';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {FormInput, FormLabel, FormValidationMessage, Button, Header} from 'react-native-elements';
// import {executePayment, checkCoupon} from '../../actions/LessonActions';
// import {roundNumber} from '../../utils/utils';
// import CardRow from '../Card/CardRow';
import KeyboardView from '../Keyboard/KeyboardView';
// import {atob} from '../../utils/base64.js';

import downtheline from '../../images/downtheline.png';
import faceon from '../../images/faceon.png';


// import Icon from 'react-native-vector-icons/FontAwesome';

function mapStateToProps(state){
    return {
        token: state.login.token,
        // packages: state.packages.list,
        // coupon: state.lessons.coupon,
        // purchaseInProgress: state.credits.inProgress,
        // purchaseSuccess: state.credits.success,
        // purchaseFail: state.credits.fail
        //username: state.userData.username,
        //lessons: state.lessons,
        //credits: state.credits
    };
}
function mapDispatchToProps(dispatch){
    return {
        // checkCoupon: (code) => {dispatch(checkCoupon(code))},
        // executePayment: (data, token) => {dispatch(executePayment(data,token))},
        // getCredits: (token) => {dispatch(getCredits(token))}
    };
}

class Redeem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // selected: props.packages[0],
            // coupon: '',
            // role: 'pending',
            // error: ''
        }
    }
    componentWillMount(){
        // check if the user is allowed to purchase
        // const role = JSON.parse(atob(this.props.token.split('.')[1])).role;
        // if(role === 'pending'){
        //     this.setState({role: 'pending', error: 'You must validate your email address before you can purchase lessons'});
        // }
        // else{
        //     this.setState({role: role, error:''});
        // }
    }
    componentDidMount(){
        if(!this.props.token){
            this.props.navigation.navigate('Login');
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.token){
            this.props.navigation.navigate('Login');
        }
    }

    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ backgroundColor: colors.lightPurple}}
                    leftComponent={{ icon: 'menu',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Submit Your Swing', style: { color: colors.white, fontSize: 18 } }}
                />

                <KeyboardView
                    fixed={
                        <Button
                            title="SUBMIT"
                            disabled={this.state.role === 'pending' || !this.state.fo || !this.state.dtl}
                            disabledStyle={styles.disabledButton}
                            onPress={()=>alert('submitted swing')}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                            containerViewStyle={styles.buttonContainer}
                        />
                    }
                >
                    <ScrollView 
                        ref={(ref) => this.scroller = ref}
                        //keyboardShouldPersistTaps={'always'}
                        >
                        <FormLabel 
                            containerStyle={styles.formLabelContainer} 
                            labelStyle={StyleSheet.flatten([styles.formLabel])}>
                            Special Requests
                        </FormLabel>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.small}}>
                            <View style={{flex: 1, borderWidth: 2, borderColor: colors.purple, backgroundColor: colors.white, height: sizes.large, marginRight: spacing.normal}}>
                                <View style={{flex: 1, margin: spacing.normal}}>
                                    <Image
                                        resizeMethod='resize'
                                        style={{height:'100%', width: '100%', resizeMode: 'contain'}}
                                        source={faceon}
                                    />
                                </View>
                            </View>
                            <View style={{flex: 1, borderWidth: 2, borderColor: colors.purple, backgroundColor: colors.white, height: sizes.large}}>
                                <View style={{flex: 1, margin: spacing.normal}}>
                                    <Image
                                        resizeMethod='resize'
                                        style={{height:'100%', width: '100%', resizeMode: 'contain'}}
                                        source={downtheline}
                                    />
                                </View>
                            </View>
                        </View>
                        <FormLabel 
                            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal}])} 
                            labelStyle={StyleSheet.flatten([styles.formLabel])}>
                            Special Requests
                        </FormLabel>
                        <FormInput
                            autoCapitalize={'none'}
                            multiline={true}
                            returnKeyType={'done'}
                            blurOnSubmit={true}
                            containerStyle={StyleSheet.flatten([styles.formInputContainer, {height: sizes.large, marginTop: spacing.small}])}
                            inputStyle={styles.formInput}
                            underlineColorAndroid={colors.transparent}
                            onFocus={() => this.scroller.scrollTo({x: 0, y: 150, animated: true})}
                            //value={this.state[item.property]}
                            //keyboardType={item.property==='email'?'email-address':'default'}
                            //secureTextEntry={item.property==='password' || item.property ==='passwordConfirm'}
                            //onChangeText={item.change}
                            //onBlur={item.blur}
                        />
                    </ScrollView>    
                </KeyboardView> 
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Redeem);