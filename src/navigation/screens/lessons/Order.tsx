import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, H7 } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout, ErrorBox, SEButton } from '../../../components';
import bg from '../../../images/bg_5.jpg';
import * as RNIap from 'react-native-iap';
import { sharedStyles, spaces, purple } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';

// TODO: Implement

export const Order = (props) => {
    const packages = useSelector(state => state.packages.list);
    const role = useSelector(state => state.login.role);

    const dispatch = useDispatch();

    const [selected, setSelected] = useState(-1);
    const [products, setProducts] = useState<RNIap.Product[]>([]);
    const [error, setError] = useState('');
    // const [active, setActive] = useState(false);

    const roleError = (role === 'anonymous') ? 'You must be signed in to purchase lessons.' : (role === 'pending') ? 'You must validate your email address before you can purchase lessons' : '';

    useEffect(() => {
        if (packages) {
            let skus: Array<string> = [];
            for (let i = 0; i < packages.length; i++) {
                skus.push(packages[i].app_sku);
            }
            // TODO: Use the real SKUs
            skus = ['com.swingessentialsbeta.par', 'com.swingessentialsbeta.eagle'];
            const loadProducts = async () => {
                try {
                    await RNIap.initConnection();
                    const verifiedProducts = await RNIap.getProducts(skus);
                    setProducts(verifiedProducts.sort(
                        (a, b) => parseInt(a.price, 10) - parseInt(b.price, 10)
                    ));
                    setSelected(0);
                } catch (err) {
                    // logLocalError('132: RNIAP Error: ' + err.code + ' ' + err.message);
                    console.log('FAILED TO FETCH IAP');
                }
            }
            loadProducts();
        }

    }, [packages]);

    const onPurchase = useCallback(
        async (sku, shortcode) => {
            if (error.length > 0) {
                console.log('error');
                // logLocalError('137: Purchase request not sent: ' + this.state.error);
                return;
            }
            if (role !== 'customer' && role !== 'administrator') {
                console.log('invalid customer: ', role);
                // logLocalError('137XX: Purchase request not sent: ' + this.state.error);
                return;
            }
            if (!sku || !shortcode) {
                console.log('missing information');
                // logLocalError('138: Purchase: missing data');
                return;
            }
            // TODO: Set up progress variables in the store
            try{
                await RNIap.requestPurchase(sku, false);
            }
            catch(error){
                console.error('promise error with RNIAP');
            }
            // Purchase response is handled in RNIAPCallbacks.tsx
        },
        [dispatch, role],
    );

    // console.log(packages);

    return (
        <CollapsibleHeaderLayout
            title={'Order Lessons'}
            subtitle={'...multiple package options'}
            backgroundImage={bg}
        >
            <ErrorBox
                show={error !== ''}
                error={error}
                style={{ marginHorizontal: spaces.medium, marginBottom: spaces.medium }}
            />
            <ErrorBox
                show={roleError !== ''}
                error={roleError}
                style={{ marginHorizontal: spaces.medium, marginBottom: spaces.medium }}
            />
            <View style={sharedStyles.sectionHeader}>
                <H7>{'Available Packages: ' + role}</H7>
            </View>
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages.slice(0, 2)}//TODO: Remove this
                extraData={products}
                renderItem={({ item, index }) =>
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        onPress={() => setSelected(index)}
                        leftIcon={{
                            name: parseInt(item.count, 10) === 1 ? 'filter-1' : 'filter-5',
                            color: purple[500],
                            iconStyle: { marginLeft: 0 },
                        }}
                        title={<Body font={'semiBold'}>{item.name}</Body>}
                        subtitle={<Body>{item.description}</Body>}
                        rightTitle={products.length > 0 ? `$${products[index].price}` : '--'}
                        rightIcon={selected === index ? {
                            name: 'check',
                            color: purple[500]
                        } : undefined}
                    />
                }
                keyExtractor={(item, index) => ('package_' + item.app_sku)}
            />
            {error.length === 0 && roleError.length === 0 &&
                <SEButton
                    containerStyle={{ margin: spaces.medium, marginTop: spaces.jumbo }}
                    buttonStyle={{ backgroundColor: purple[400] }}
                    title={<H7 color={'onPrimary'}>PURCHASE</H7>}
                    // TODO: Update to production
                    onPress={() => onPurchase(packages[selected].app_sku.replace('swingessentials','swingessentialsbeta'), packages[selected].shortcode)}
                />
            }
            <SEButton
                    containerStyle={{ margin: spaces.medium, marginTop: spaces.jumbo }}
                    buttonStyle={{ backgroundColor: purple[400] }}
                    title={<H7 color={'onPrimary'}>RESET</H7>}
                    // TODO: Update to production
                    onPress={async () => {
                        console.log('press');
                        const available = await RNIap.getAvailablePurchases();
                        // console.log(available);
                        for(let i = 0; i < available.length; i++){
                            console.log(available[i].transactionId);
                            RNIap.finishTransactionIOS(available[i].transactionId);
                        }
                    }}
                />

        </CollapsibleHeaderLayout>
    )
};

// import React from 'react';
// import {connect} from 'react-redux';

// import {Alert, ActivityIndicator, Text, View, ScrollView, FlatList, StyleSheet, Platform} from 'react-native';
// import styles, {colors, spacing} from '../../styles/index';
// import {scale} from '../../styles/dimension';

// import Header from '../Header/Header';
// import {Button} from 'react-native-elements';
// import {executePayment, checkCoupon, activateUnlimited} from '../../actions/LessonActions';

// import CardRow from '../Card/CardRow';
// import KeyboardView from '../Keyboard/KeyboardView';
// import {atob} from '../../utils/base64.js';
// import * as RNIap from 'react-native-iap';

// import Tutorial from '../Tutorial/Order';
// import {TUTORIALS} from '../../constants/index';
// import { tutorialViewed } from '../../actions/TutorialActions';
// import { logLocalError } from '../../utils/utils';

// function mapStateToProps(state){
//     return {
//         token: state.login.token,
//         packages: state.packages.list,
//         coupon: state.lessons.coupon,
//         purchaseInProgress: state.credits.inProgress,
//         purchaseSuccess: state.credits.success,
//         purchaseFail: state.credits.fail,
//         lessons: state.lessons,
//         credits: state.credits,
//         showTutorial: state.tutorial[TUTORIALS.ORDER]
//     };
// }
// function mapDispatchToProps(dispatch){
//     return {
//         checkCoupon: (code) => {dispatch(checkCoupon(code))},
//         executePayment: (data, token, platform) => {dispatch(executePayment(data,token, platform))},
//         activateUnlimited: (token) => {dispatch(activateUnlimited(token))},
//         closeTutorial: () => {dispatch(tutorialViewed(TUTORIALS.ORDER))}
//     };
// }

// class Order_OLD extends React.Component{



//     render(){
//         return(
//             <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
//                 <Header title={'Order Lessons'} navigation={this.props.navigation}/>
//                 {(this.props.purchaseFail || this.state.iap_error) && 
//                     <ScrollView style={{padding: spacing.normal}}>
//                         <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: 0}])}>There was an error processing your purchase. Please try again later or contact info@swingessentials.com for more information.</Text>
//                         <Button
//                             title="BACK TO LESSONS"
//                             fontSize={scale(14)}
//                             onPress={()=> this.props.navigation.navigate('Lessons')}
//                             buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                             containerViewStyle={styles.buttonContainer}
//                             fontSize={scale(14)}
//                         />
//                     </ScrollView>
//                 }
//                 {this.props.purchaseSuccess && 
//                     <ScrollView style={{padding: spacing.normal}}>
//                         <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: 0, marginBottom: 0}])}>Thank you for your purchase!</Text>
//                         {this.state.selected.shortcode !== 'albatross' &&
//                             <Button
//                                 title="REDEEM NOW"
//                                 fontSize={scale(14)}
//                                 onPress={()=> {
//                                     if(this.props.lessons.pending.length < 1){
//                                         this.props.navigation.navigate('RedeemTop');
//                                     }
//                                     else{
//                                         Alert.alert(
//                                             'Swing Analysis Pending',
//                                             'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
//                                             [{text: 'OK'}]
//                                         );
//                                     }
//                                 }}
//                                 buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                                 containerViewStyle={styles.buttonContainer}
//                             />
//                         }
//                         {this.state.selected.shortcode === 'albatross' &&
//                             this.props.credits.unlimitedExpires <= Date.now()/1000 &&
//                             <Button
//                                 title="ACTIVATE NOW"
//                                 fontSize={scale(14)}
//                                 onPress={()=> {
//                                     Alert.alert(
//                                         'Activate Unlimited',
//                                         'Activating your unlimited lessons deal will give you access to unlimited lessons for 30 days. The clock starts when you click Activate.',
//                                         [
//                                             {text: 'Cancel'},
//                                             {text: 'Activate', 
//                                                 onPress: () => {
//                                                     this.props.activateUnlimited(this.props.token);
//                                                     this.props.navigation.navigate('Lessons');
//                                                 }
//                                             }
//                                         ]
//                                     )
//                                 }}
//                                 buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                                 containerViewStyle={styles.buttonContainer}
//                             />
//                         }
//                         {this.state.selected.shortcode === 'albatross' &&
//                             this.props.credits.unlimitedExpires > Date.now()/1000 &&
//                             <Button
//                                 title="SUBMIT A SWING"
//                                 fontSize={scale(14)}
//                                 onPress={()=> {
//                                     if(this.props.lessons.pending.length < 1){
//                                         this.props.navigation.navigate('RedeemTop');
//                                     }
//                                     else{
//                                         Alert.alert(
//                                             'Swing Analysis Pending',
//                                             'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
//                                             [{text: 'OK'}]
//                                         );
//                                     }
//                                 }}
//                                 buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                                 containerViewStyle={styles.buttonContainer}
//                             />
//                         }
//                         <Button
//                             title={"BACK TO LESSONS"}
//                             fontSize={scale(14)}
//                             onPress={()=> this.props.navigation.navigate('Lessons')}
//                             buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                             containerViewStyle={styles.buttonContainer}
//                         />
//                     </ScrollView>
//                 }
//                 {!this.props.purchaseFail && !this.props.purchaseSuccess && !this.state.iap_error &&
//                     <KeyboardView
//                         fixed={
//                             (!this.props.purchaseInProgress && !this.state.paymentActive) ?
//                             <Button
//                                 title={'PURCHASE'}
//                                 fontSize={scale(14)}
//                                 disabled={this.state.role === 'pending' || this.state.role === 'anonymous' || this.props.purchaseInProgress || this.state.paymentActive || this.state.products.length < 1}
//                                 disabledStyle={styles.disabledButton}
//                                 onPress={()=>this._purchaseLesson({
//                                     package: this.state.selected.shortcode,
//                                     sku: this.state.products[this.state.selectedIndex].productId
//                                 })}
//                                 buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
//                                 containerViewStyle={styles.buttonContainer}
//                             /> 
//                             :
//                             <ActivityIndicator 
//                                 style={{marginTop: spacing.normal}} 
//                                 size={'large'} 
//                                 color={colors.purple}
//                             />
//                         }
//                     >
//                         <ScrollView ref={(ref) =>this.scroller=ref} 
//                             keyboardShouldPersistTaps={'always'}
//                         >
//                             {this.state.error !== '' && 
//                                 <Text style={StyleSheet.flatten([styles.formValidation, {marginBottom: spacing.normal}])}>
//                                     {this.state.error}
//                                 </Text>
//                             }
//                             <FlatList
//                                 scrollEnabled= {false}
//                                 keyboardShouldPersistTaps = {'always'}
//                                 ListHeaderComponent={
//                                     <View style={styles.cardHeader}>
//                                         <Text style={{fontSize: scale(14), color: colors.white}}>Select a Package</Text>
//                                     </View>
//                                 }
//                                 data={this.props.packages}
//                                 extraData={this.state.products}
//                                 renderItem={({item, index}) => 
//                                     <CardRow 
//                                         primary={item.name} 
//                                         subtitle={item.description}
//                                         secondary={this.state.products.length > 0 ? `$${this.state.products[index].price}` : '--'}
//                                         action={this.props.purchaseInProgress ? null : ()=>this.setState({selected: item, selectedIndex: index})}
//                                         menuItem
//                                         selected={this.state.selected.shortcode === item.shortcode}
//                                     />
//                                 }
//                                 keyExtractor={(item, index) => ('package_'+item.id)}
//                             />
//                         </ScrollView>   
//                         <Tutorial isVisible={this.props.showTutorial} close={()=>this.props.closeTutorial()}/>        
//                     </KeyboardView> 
//                 }           
//             </View>

//         );
//     }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Order_OLD);