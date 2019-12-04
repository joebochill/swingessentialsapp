import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCredits } from '../../../redux/actions';

export const RNIAPCallbacks = (props) => {
    const dispatch = useDispatch();
    const packages = useSelector(state => state.packages.list);

    useEffect(() => {
        const purchaseUpdateSubscription = purchaseUpdatedListener((purchase: any) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                const paidPackage = packages.filter((pack) => pack.app_sku === purchase.productId);
                let shortcode;
                if (paidPackage.length > 0) shortcode = paidPackage[0].shortcode;
                else shortcode = 'par'; // TODO : remove this
                dispatch(purchaseCredits({
                    receipt,
                    package: shortcode
                }, (response) => {
                    // API call is a success
                    if (Platform.OS === 'ios') {
                        RNIap.finishTransactionIOS(purchase.transactionId);
                    }
                    else if (Platform.OS === 'android') {
                        // If consumable (can be purchased again)
                        RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                        // If not consumable
                        // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                    }
                    RNIap.finishTransaction(purchase);
                }, (response) => {
                    if (response.headers.get('Error') == '400607') {
                        if (Platform.OS === 'ios') {
                            RNIap.finishTransactionIOS(purchase.transactionId);
                        }
                        else if (Platform.OS === 'android') {
                            // If consumable (can be purchased again)
                            RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                            // If not consumable
                            // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                        }
                    }
                }));
                // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                console.log('bad purchase');
            }
        });
        const purchaseErrorSubscription = purchaseErrorListener((error: any) => {
            console.warn('purchaseErrorListener', error);
        })
    }, [])
    return null;
}
