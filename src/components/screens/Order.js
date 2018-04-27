import React from 'react';
import {connect} from 'react-redux';

import {Alert, ActivityIndicator, Text, View, ScrollView, Keyboard, FlatList, StyleSheet, Platform} from 'react-native';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {scale, verticalScale} from '../../styles/dimension';

import {FormInput, Button, Header} from 'react-native-elements';
import {executePayment, checkCoupon, activateUnlimited} from '../../actions/LessonActions';
import {roundNumber} from '../../utils/utils';
import CardRow from '../Card/CardRow';
import KeyboardView from '../Keyboard/KeyboardView';
import {atob} from '../../utils/base64.js';
import * as RNIap from 'react-native-iap';

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
    };
}

class Order extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selected: props.packages[0],
            //coupon: '',
            role: 'pending',
            error: '',
            products: []
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

            //get the package SKU numbers from the packages object
            if(this.props.packages){
                let skus = [];
                for(let i = 0; i < this.props.packages.length; i++){
                    //skus.push(this.props.packages[i].sku);
                    skus.push(this.props.packages[i].ios_sku);
                }
                this.skus = skus;
            }
        }
    }
    componentDidMount(){
        try {
            RNIap.prepare()
            .then(() => {
                RNIap.getProducts(this.skus)
                .then((products) => {
                    // console.log(products);
                    this.setState({products: products.sort(
                        (a,b)=>{
                            return parseInt(a.price, 10) > parseInt(b.price,10)
                        }
                    )});
                })
            })
        } catch(err) {
            // TODO: Proper error handling
            //alert(err); // standardized err.code and err.message available
            // console.log(err.message);
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.token){
            this.props.navigation.navigate('Auth');
        }
    }
    componentWillUnmount(){
        RNIap.endConnection();
    }

    _purchaseLesson(data){
        if(this.state.role === 'pending'){
            return;
        }
        if(!data){ return;}
        this.setState({paymentActive: true});
        RNIap.buyProduct('com.swingessentials.'+data.package).then(purchase => {
            this.props.executePayment({...data, receipt: purchase.transactionReceipt},this.props.token)
            this.setState({paymentActive: false});
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
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ 
                        backgroundColor: colors.lightPurple, 
                        height: verticalScale(Platform.OS === 'ios' ? 70 :  70 - 24), 
                        padding: verticalScale(Platform.OS === 'ios' ? 15 : 10)
                    }}
                    leftComponent={{ 
                        icon: 'menu',
                        underlayColor:colors.transparent, 
                        color: colors.white, 
                        containerStyle:styles.headerIcon, 
                        size: verticalScale(26),
                        onPress: () => this.props.navigation.navigate('DrawerOpen') 
                    }}
                    centerComponent={{ text: 'Order Lessons', style: { color: colors.white, fontSize: verticalScale(18) } }}
                />
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
                                disabled={this.state.role === 'pending' || this.props.purchaseInProgress || this.state.paymentActive || this.state.products.length < 1}
                                disabledStyle={styles.disabledButton}
                                onPress={()=>this._purchaseLesson({
                                    package: this.state.selected.shortcode
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
                                renderItem={({item, index}) => 
                                    <CardRow 
                                        primary={item.name} 
                                        subtitle={item.description}
                                        secondary={this.state.products.length > 0 ? `$${this.state.products[index].price}` : '--'}
                                        action={this.props.purchaseInProgress ? null : ()=>this.setState({selected: item})}
                                        menuItem
                                        selected={this.state.selected.shortcode === item.shortcode}
                                    />
                                }
                                keyExtractor={(item, index) => item.id}
                            />
                        </ScrollView>    
                    </KeyboardView> 
                }           
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);