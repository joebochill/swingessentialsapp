import React from 'react';
import {connect} from 'react-redux';

import {Alert, ActivityIndicator, Text, View, ScrollView, FlatList, StyleSheet, Platform} from 'react-native';
import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import Header from '../Header/Header';
import {Button} from 'react-native-elements';
import {executePayment, checkCoupon, activateUnlimited} from '../../actions/LessonActions';

import CardRow from '../Card/CardRow';
import KeyboardView from '../Keyboard/KeyboardView';
import {atob} from '../../utils/base64.js';
import * as RNIap from 'react-native-iap';

import Tutorial from '../Tutorial/Order';
import {TUTORIALS} from '../../constants/index';
import { tutorialViewed } from '../../actions/TutorialActions';

function mapStateToProps(state){
    return {
        token: state.login.token,
        packages: state.packages.list,
        coupon: state.lessons.coupon,
        purchaseInProgress: state.credits.inProgress,
        purchaseSuccess: state.credits.success,
        purchaseFail: state.credits.fail,
        lessons: state.lessons,
        credits: state.credits,
        showTutorial: state.tutorial[TUTORIALS.ORDER]
    };
}
function mapDispatchToProps(dispatch){
    return {
        checkCoupon: (code) => {dispatch(checkCoupon(code))},
        executePayment: (data, token, platform) => {dispatch(executePayment(data,token, platform))},
        activateUnlimited: (token) => {dispatch(activateUnlimited(token))},
        closeTutorial: () => {dispatch(tutorialViewed(TUTORIALS.ORDER))}
    };
}

class Order extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selected: props.packages[0],
            selectedIndex: 0,
            //coupon: '',
            role: 'pending',
            error: '',
            products: []
        }
    }
    componentWillMount(){
        this._updateUserRole(this.props.token);         
        //get the package SKU numbers from the packages object
        if(this.props.packages){
            let skus = [];
            for(let i = 0; i < this.props.packages.length; i++){
                skus.push(this.props.packages[i].app_sku);
            }
            this.skus = skus;
        }
    }
    componentDidMount(){
        try {
            RNIap.prepare()
            .then(() => {
                RNIap.getProducts(this.skus)
                .then((products) => {
                    this.setState({products: products.sort(
                        (a,b)=>{
                            return parseInt(a.price, 10) - parseInt(b.price,10);
                        }
                    )});
                });
            });
        } catch(err) {
            // TODO: Proper error handling
            //alert(err); // standardized err.code and err.message available
            // console.log(err.message);
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.token !== this.props.token){
            this._updateUserRole(nextProps.token);
        }
    }
    componentWillUnmount(){
        RNIap.endConnection();
    }

    // _clearPurchases(){
    //     RNIap.getAvailablePurchases()
    //     .then((purchaseList) => {
    //         purchaseList.forEach(element => {
    //             RNIap.consumePurchase(element.transactionReceipt);
    //         });
    //     })
    //     .catch((err)=>{
    //         alert(err.message);
    //     });
    // }

    _updateUserRole(token){
        if(!token){
            this.setState({role: 'anonymous', error: 'You must be signed in to purchase lessons'});
        }
        else{
            // check if the user is allowed to purchase
            const role = JSON.parse(atob(token.split('.')[1])).role;
            if(role === 'pending'){
                this.setState({role: 'pending', error: 'You must validate your email address before you can purchase lessons'});
            }
            else{
                this.setState({role: role, error:''});
            }    
        }    
    }

    _purchaseLesson(data){
        if(this.state.error !== '' || this.state.role === ''){
            return;
        }
        if(!data){return;}
        this.setState({paymentActive: true});
        RNIap.buyProduct(data.sku).then(purchase => {
            this.props.executePayment({...data, receipt: purchase.transactionReceipt},this.props.token, Platform.OS);
            //console.log(purchase.transactionReceipt);

            this.setState({paymentActive: false});
            if(Platform.OS === 'android') {
                RNIap.consumePurchase(purchase.transactionReceipt);
            }

          }).catch(err => {
              console.log(err);
            this.setState({iap_error: err.code === 'E_USER_CANCELLED' ? false : true, paymentActive: false});
            // TODO: proper error handling for errors
            //alert(err.message);
          })
    }

    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header title={'Order Lessons'} navigation={this.props.navigation}/>
                {(this.props.purchaseFail || this.state.iap_error) && 
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
                {!this.props.purchaseFail && !this.props.purchaseSuccess && !this.state.iap_error &&
                    <KeyboardView
                        fixed={
                            (!this.props.purchaseInProgress && !this.state.paymentActive) ?
                            <Button
                                title={'PURCHASE'}
                                fontSize={scale(14)}
                                disabled={this.state.role === 'pending' || this.state.role === 'anonymous' || this.props.purchaseInProgress || this.state.paymentActive || this.state.products.length < 1}
                                disabledStyle={styles.disabledButton}
                                onPress={()=>this._purchaseLesson({
                                    package: this.state.selected.shortcode,
                                    sku: this.state.products[this.state.selectedIndex].productId
                                })}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
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
                                extraData={this.state.products}
                                renderItem={({item, index}) => 
                                    <CardRow 
                                        primary={item.name} 
                                        subtitle={item.description}
                                        secondary={this.state.products.length > 0 ? `$${this.state.products[index].price}` : '--'}
                                        action={this.props.purchaseInProgress ? null : ()=>this.setState({selected: item, selectedIndex: index})}
                                        menuItem
                                        selected={this.state.selected.shortcode === item.shortcode}
                                    />
                                }
                                keyExtractor={(item, index) => item.id}
                            />
                        </ScrollView>   
                        <Tutorial isVisible={this.props.showTutorial} close={()=>this.props.closeTutorial()}/>        
                    </KeyboardView> 
                }           
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);