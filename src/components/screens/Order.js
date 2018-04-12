import React from 'react';
import {connect} from 'react-redux';

import {Alert, ActivityIndicator, Text, View, ScrollView, Keyboard, FlatList, StyleSheet, Platform} from 'react-native';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {scale, verticalScale, moderateScale} from '../../styles/dimension';

import {FormInput, Button, Header} from 'react-native-elements';
import {executePayment, checkCoupon, activateUnlimited} from '../../actions/LessonActions';
import {roundNumber} from '../../utils/utils';
import CardRow from '../Card/CardRow';
import KeyboardView from '../Keyboard/KeyboardView';
import {atob} from '../../utils/base64.js';

// import BraintreeDropIn from 'react-native-braintree-payments-drop-in';
var BTClient = require('react-native-braintree-xplat');
if (Platform.OS === 'ios') {
    BTClient.setupWithURLScheme('sandbox_2pqkx4x6_g7sz9ynwdm65gwxj', 'org.reactjs.native.example.swingessentialsapp.btpayments');
} else {
    BTClient.setup('sandbox_2pqkx4x6_g7sz9ynwdm65gwxj');
}
//BTClient.setup('sandbox_4stxm9hm_tbzth8d9frwrdw6z');//joe's braintree

// import Icon from 'react-native-vector-icons/FontAwesome';

function mapStateToProps(state){
    return {
        token: state.login.token,
        packages: state.packages.list,
        coupon: state.lessons.coupon,
        purchaseInProgress: state.credits.inProgress,
        purchaseSuccess: state.credits.success,
        purchaseFail: state.credits.fail,
        //username: state.userData.username,
        lessons: state.lessons,
        credits: state.credits
    };
}
function mapDispatchToProps(dispatch){
    return {
        checkCoupon: (code) => {dispatch(checkCoupon(code))},
        executePayment: (data, token) => {dispatch(executePayment(data,token))},
        activateUnlimited: (token) => {dispatch(activateUnlimited(token))}
        // getCredits: (token) => {dispatch(getCredits(token))}
    };
}

class Order extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selected: props.packages[0],
            coupon: '',
            role: 'pending',
            error: ''
        }
    }
    componentWillMount(){
        if(!this.props.token){
            this.props.navigation.navigate('Auth');
        }
        else{
            // check if the user is allowed to purchase
            const role = JSON.parse(atob(this.props.token.split('.')[1])).role;
            if(role === 'pending'){
                this.setState({role: 'pending', error: 'You must validate your email address before you can purchase lessons'});
            }
            else{
                this.setState({role: role, error:''});
            }    
        }
    }
    componentDidMount(){
        // if(!this.props.token){
        //     this.props.navigation.navigate('Auth');
        // }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.token){
            this.props.navigation.navigate('Auth');
        }
        // else if(!nextProps.lessons.loading && !nextProps.credits.inProgress){
        //     this.setState({refreshing: false});
        // }
    }
    _getTotal(){
        if(this.props.coupon.value <= 0){
            return this.state.selected.price;
        }
        else if(this.props.coupon.type === 'amount'){
            return roundNumber(Math.max(this.state.selected.price-this.props.coupon.value, 0), 2).toFixed(2);
        }
        else if(this.props.coupon.type === 'percent'){
            return roundNumber(Math.max(this.state.selected.price-(this.props.coupon.value/100)*this.state.selected.price, 0), 2).toFixed(2);
        }
        else{
            return this.state.selected.price;
        }
    }

    _checkCoupon(){
        Keyboard.dismiss();
        if(!this.state.coupon){return;}
        this.props.checkCoupon(this.state.coupon);
        this.setState({coupon: ''});
    }

    _purchaseLesson(data){
        if(this.state.role === 'pending'){
            return;
        }
        if(!data){ return;}

        if(data.total > 0){
            this.setState({payPalActive: true}, () => {
                this.forceUpdate();
                BTClient.showPayPalViewController().then((nonce) => {
                    Alert.alert(
                        'Confirm Payment',
                        'You are about to pay $' + data.total + ' for a ' + this.state.selected.name + ' (' + this.state.selected.description + ').',
                        [
                            {text: 'Cancel'},
                            {text: 'Confirm', onPress: () => this.props.executePayment({...data, nonce: nonce},this.props.token)}
                            
                        ]
                    );
                })
                .catch(function(err) {
                    //do nothing for now, we handle errors via the API
                });
                this.setState({payPalActive: false});
            });
        }
        else{
            Alert.alert(
                'Confirm Payment',
                'You are about to pay $' + data.total + ' for a ' + this.state.selected.name + ' (' + this.state.selected.description + ').',
                [
                    {text: 'Cancel'},
                    {text: 'Confirm', onPress: () => this.props.executePayment({...data, nonce: 'N/A'},this.props.token)}
                    
                ]
            );
        }
    }

    render(){
        let free = (this._getTotal() <= 0);
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ 
                        backgroundColor: colors.lightPurple, 
                        height: Platform.OS === 'ios' ? 70 :  70 - 24, 
                        padding: Platform.OS === 'ios' ? 15 : 10
                    }}
                    //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
                    leftComponent={{ icon: 'menu',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Order Lessons', style: { color: colors.white, fontSize: 18 } }}
                />
                {this.props.purchaseFail && 
                    <ScrollView style={{padding: spacing.normal}}>
                        <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: 0}])}>There was an error processing your purchase. Please try again later or contact info@swingessentials.com for more information.</Text>
                        <Button
                            title="BACK TO LESSONS"
                            fontSize={scale(14)}
                            onPress={()=> this.props.navigation.navigate('Lessons')}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                            containerViewStyle={styles.buttonContainer}
                            fontSize={scale(14)}
                        />
                    </ScrollView>
                }
                {this.props.purchaseSuccess && 
                    <ScrollView style={{padding: spacing.normal}}>
                        <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: 0}])}>Thank you for your purchase!</Text>
                        {this.state.selected.shortcode !== 'albatross' &&
                            <Button
                                title="REDEEM NOW"
                                fontSize={scale(14)}
                                onPress={()=> {
                                    if(this.props.lessons.pending.length < 1){
                                        this.props.navigation.navigate('RedeemTop');
                                    }
                                    else{
                                        Alert.alert(
                                            'Swing Analysis Pending',
                                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                            [{text: 'OK'}]
                                        );
                                    }
                                }}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                containerViewStyle={styles.buttonContainer}
                            />
                        }
                        {this.state.selected.shortcode === 'albatross' &&
                            this.props.credits.unlimitedExpires <= Date.now()/1000 &&
                            <Button
                                title="ACTIVATE NOW"
                                fontSize={scale(14)}
                                onPress={()=> {
                                    Alert.alert(
                                        'Activate Unlimited',
                                        'Activating your unlimited lessons deal will give you access to unlimited lessons for 30 days. The clock starts when you click Activate.',
                                        [
                                            {text: 'Cancel'},
                                            {text: 'Activate', 
                                                onPress: () => {
                                                    this.props.activateUnlimited(this.props.token);
                                                    this.props.navigation.navigate('Lessons');
                                                }
                                            }
                                        ]
                                    )
                                }}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                containerViewStyle={styles.buttonContainer}
                            />
                        }
                        {this.state.selected.shortcode === 'albatross' &&
                            this.props.credits.unlimitedExpires > Date.now()/1000 &&
                            <Button
                                title="SUBMIT A SWING"
                                fontSize={scale(14)}
                                onPress={()=> {
                                    if(this.props.lessons.pending.length < 1){
                                        this.props.navigation.navigate('RedeemTop');
                                    }
                                    else{
                                        Alert.alert(
                                            'Swing Analysis Pending',
                                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                            [{text: 'OK'}]
                                        );
                                    }
                                }}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                                containerViewStyle={styles.buttonContainer}
                            />
                        }
                        <Button
                            title={"BACK TO LESSONS"}
                            fontSize={scale(14)}
                            onPress={()=> this.props.navigation.navigate('Lessons')}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                            containerViewStyle={styles.buttonContainer}
                        />
                    </ScrollView>
                }
                {!this.props.purchaseFail && !this.props.purchaseSuccess &&
                    <KeyboardView
                        fixed={
                            (!this.props.purchaseInProgress && !this.state.payPalActive) ?
                            <Button
                                title={free ? "COMPLETE PURCHASE" : "Pay with PayPal"}
                                fontSize={scale(14)}
                                disabled={this.state.role === 'pending' || this.props.purchaseInProgress || this.state.payPalActive}
                                disabledStyle={styles.disabledButton}
                                fontWeight={free? null : '900'}
                                onPress={()=>this._purchaseLesson({
                                    package: this.state.selected.shortcode,
                                    coupon: this.props.coupon.code,
                                    total: this._getTotal()
                                })}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}, !free ? {backgroundColor: '#009cde', borderColor: colors.transparent} : {}])}
                                containerViewStyle={styles.buttonContainer}
                            /> 
                            :
                            <ActivityIndicator 
                                style={{marginTop: spacing.normal}} 
                                size={'large'} 
                                color={colors.purple}
                            />
                        }
                    >
                        <ScrollView ref={(ref) =>this.scroller=ref} 
                            keyboardShouldPersistTaps={'always'}
                        >
                            {this.state.error !== '' && 
                                <Text style={StyleSheet.flatten([styles.formValidation, {marginBottom: spacing.normal}])}>
                                    {this.state.error}
                                </Text>
                            }
                            <FlatList
                                scrollEnabled= {false}
                                keyboardShouldPersistTaps = {'always'}
                                ListHeaderComponent={
                                    <View style={styles.cardHeader}>
                                        <Text style={{fontSize: scale(14), color: colors.white}}>Select a Package</Text>
                                    </View>
                                }
                                data={this.props.packages}
                                renderItem={({item, index}) => 
                                    <CardRow 
                                        primary={item.name} 
                                        subtitle={item.description}
                                        secondary={`$${item.price}`}
                                        action={this.props.purchaseInProgress ? null : ()=>this.setState({selected: item})}
                                        menuItem
                                        selected={this.state.selected.shortcode === item.shortcode}
                                    />
                                }
                                keyExtractor={(item, index) => item.id}
                            />
                            <FlatList
                                style={{marginTop: spacing.normal}}
                                scrollEnabled= {false}
                                keyboardShouldPersistTaps = {'always'}
                                ListHeaderComponent={
                                    <View style={styles.cardHeader}>
                                        <Text style={{fontSize: scale(14), color: colors.white}}>Discount Code</Text>
                                    </View>
                                }
                                data={[{id: 1}]}
                                renderItem={({item, index}) => 
                                    <View style={{flexDirection: 'row', height: sizes.normal, marginTop: spacing.small}}>
                                        <FormInput
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            onFocus= {() => this.scroller.scrollTo({x: 0, y: 150, animated: true})}
                                            disabled={this.props.purchaseInProgress}
                                            containerStyle={StyleSheet.flatten([styles.formInputContainer, {flex: 1}])}
                                            inputStyle={styles.formInput}
                                            underlineColorAndroid={colors.transparent}
                                            value={this.state.coupon}
                                            onChangeText={(text)=>this.setState({coupon: text})}
                                        />
                                        <Button
                                            title="APPLY"
                                            fontSize={scale(14)}
                                            disabled={!this.state.coupon || this.props.purchaseInProgress}
                                            onPress={()=> {this._checkCoupon()}}
                                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: 0}])}
                                            disabledStyle={styles.disabledButton}
                                            containerViewStyle={StyleSheet.flatten([styles.buttonContainer, {marginRight: 0, width: 'auto'}])}
                                        />
                                    </View>
                                }
                                keyExtractor={(item, index) => item.id}
                            />
                            {this.props.coupon.error !== '' && 
                                <Text style={StyleSheet.flatten([styles.formValidation, {marginTop: spacing.normal}])} >
                                    {this.props.coupon.error}
                                </Text>
                            }
                            <FlatList
                                style={{marginTop: spacing.normal}}
                                scrollEnabled= {false}
                                keyboardShouldPersistTaps = {'always'}
                                ListHeaderComponent={
                                    <View style={styles.cardHeader}>
                                        <Text style={{fontSize: scale(14), color: colors.white}}>Order Details</Text>
                                    </View>
                                }
                                data={[
                                    {primary: 'Sub-total', secondary: `$${this.state.selected.price}`},
                                    ...(this.props.coupon.value > 0 ? [{
                                        primary: 'Discount', 
                                        subtitle: (this.props.coupon.type === 'amount' ? '$' : '') + this.props.coupon.value +
                                            (this.props.coupon.type === 'percent' ? '% off' : ' off'), 
                                        secondary: '-$'+roundNumber(this.state.selected.price - this._getTotal(), 2).toFixed(2)
                                    }] : []),
                                    {primary: 'Tax', secondary: '$0.00'},
                                    {primary: 'Total', secondary: '$'+this._getTotal()}
                                ]}
                                renderItem={({item, index}) => 
                                    <CardRow 
                                        primary={item.primary} 
                                        subtitle={item.subtitle}
                                        secondary={item.secondary}
                                    />
                                }
                                keyExtractor={(item, index) => index}
                            />
                        </ScrollView>    
                    </KeyboardView> 
                }           
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);