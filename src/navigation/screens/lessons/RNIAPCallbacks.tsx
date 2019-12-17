import { useEffect } from 'react';
import { Platform } from 'react-native';
import RNIap, { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCredits } from '../../../redux/actions';
import { ApplicationState } from '../../../__types__';

// TODO: confirm this is still working
export const RNIAPCallbacks = () => {
    const dispatch = useDispatch();
    const packages = useSelector((state: ApplicationState) => state.packages.list);

    // TODO: Fix the count issue when using in production

    useEffect(() => {
        purchaseUpdatedListener((purchase: any) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                const paidPackage = packages.filter(pack => pack.app_sku === purchase.productId);
                let shortcode = paidPackage.length > 0 ? paidPackage[0].shortcode : '';
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
                        },
                        (response: Response) => {
                            if (parseInt(response.headers.get('Error') || '', 10) === 400607) {
                                if (Platform.OS === 'ios') {
                                    RNIap.finishTransactionIOS(purchase.transactionId);
                                } else if (Platform.OS === 'android') {
                                    // If consumable (can be purchased again)
                                    RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                                    // If not consumable
                                    // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                                }
                            }
                        },
                    ),
                );
                // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                console.log('bad purchase');
            }
        });
        purchaseErrorListener((error: any) => {
            console.warn('purchaseErrorListener', error);
        });
    }, [dispatch, packages]);
    return null;
};
