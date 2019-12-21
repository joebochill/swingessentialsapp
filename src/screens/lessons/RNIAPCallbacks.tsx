import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import RNIap, { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCredits } from '../../redux/actions';
import { ApplicationState } from '../../__types__';
import { Logger } from '../../utilities/logging';

// TODO: confirm this is still working
export const RNIAPCallbacks = () => {
    const dispatch = useDispatch();
    const packages = useSelector((state: ApplicationState) => state.packages.list);

    // TODO: Fix the count issue when using in production (double redeem)

    useEffect(() => {
        const pil = purchaseUpdatedListener((purchase: any) => {
            const receipt = purchase.transactionReceipt;
            Alert.alert(receipt);
            Alert.alert(purchase.productId);
            if (receipt) {
                const paidPackage = packages.filter(pack => pack.app_sku === purchase.productId);
                let shortcode = paidPackage.length > 0 ? paidPackage[0].shortcode : '';
                Alert.alert('have receipt: ' + shortcode);
                if(shortcode === '') return;
                dispatch(
                    purchaseCredits(
                        {
                            receipt,
                            package: shortcode,
                        },
                        () => {
                            // API call is a success
                            if (Platform.OS === 'ios') {
                                RNIap.finishTransactionIOS(purchase.transactionId);
                            } else if (Platform.OS === 'android') {
                                // If consumable (can be purchased again)
                                RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                                // If not consumable
                                // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                            }
                            RNIap.finishTransaction(purchase);
                            Alert.alert('purchase api success');
                        },
                        (response: Response) => {
                            Alert.alert('purchase failed in API');
                            // If purchase is already claimed in database
                            if (parseInt(response.headers.get('Error') || '', 10) === 400607) {
                                Alert.alert('already claimed');
                                if (Platform.OS === 'ios') {
                                    RNIap.finishTransactionIOS(purchase.transactionId);
                                } else if (Platform.OS === 'android') {
                                    // If consumable (can be purchased again)
                                    RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                                    // If not consumable
                                    // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                                }
                            }
                            // Else, do nothing and try again on next load
                        },
                    ),
                );
                // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                Logger.logError({
                    code: 'IAP999',
                    description: `Invalid purchase detected.`,
                    rawErrorMessage: receipt,
                })
            }
        });
        const pel = purchaseErrorListener((error: any) => {
            Logger.logError({
                code: 'IAP800',
                description: `In-App purchase error.`,
                rawErrorCode: error.code,
                rawErrorMessage: error.message,
            })
        });
    }, [dispatch, packages]);
    return null;
};
