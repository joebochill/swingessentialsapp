import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { Platform } from 'react-native';
import RNIap, { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';

// Redux
import { purchaseCredits } from '../../redux/actions';

// Types
import { ApplicationState } from '../../__types__';

// Utilities
import { Logger } from '../../utilities/logging';

export const RNIAPCallbacks = () => {
    const dispatch = useDispatch();
    const packages = useSelector((state: ApplicationState) => state.packages.list);

    useEffect(() => {
        const pil = purchaseUpdatedListener((purchase: any) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                const paidPackage = packages.filter(pack => pack.app_sku === purchase.productId);
                let shortcode = paidPackage.length > 0 ? paidPackage[0].shortcode : '';
                if (shortcode === '') {
                    return;
                }
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
                            // If purchase is already claimed in database
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
                            // Else, do nothing and try again on next load
                        },
                    ),
                );
                // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                Logger.logError({
                    code: 'IAP999',
                    description: 'Invalid purchase detected.',
                    rawErrorMessage: receipt,
                });
            }
        });
        const pel = purchaseErrorListener((error: any) => {
            Logger.logError({
                code: 'IAP800',
                description: 'In-App purchase error.',
                rawErrorCode: error.code,
                rawErrorMessage: error.message,
            });
        });
    }, [dispatch, packages]);
    return null;
};
