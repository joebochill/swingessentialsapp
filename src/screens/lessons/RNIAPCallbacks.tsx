import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// TODO: Note this implementation changed slightly since the iOS version was released

// Components
import { Platform, EmitterSubscription } from 'react-native';
import {
    // InAppPurchase,
    PurchaseError,
    SubscriptionPurchase,
    // acknowledgePurchaseAndroid,
    // consumePurchaseAndroid,
    finishTransaction,
    // finishTransactionIOS,
    purchaseErrorListener,
    purchaseUpdatedListener,
    initConnection,
    // consumeAllItemsAndroid,
    flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';

// Redux
import { purchaseCredits } from '../../redux/actions';

// Types
import { ApplicationState } from '../../__types__';

// Utilities
import { Logger } from '../../utilities/logging';

let PURCHASE_UPDATE_SUBSCRIPTION: EmitterSubscription | null;
let PURCHASE_ERROR_SUBSCRIPTION: EmitterSubscription | null;

export const RNIAPCallbacks: React.FC = () =>
    // const dispatch = useDispatch();
    // const packages = useSelector((state: ApplicationState) => state.packages.list);

    // // clear all android purchases on initial load
    // useEffect(() => {
    //     const update = async (): Promise<void> => {
    //         try {
    //             await flushFailedPurchasesCachedAsPendingAndroid(); // await consumeAllItemsAndroid();
    //         } catch (e) {
    //             // No purchases available to consume
    //         }
    //     };
    //     void update();
    // }, []);

    // // Handle the active purchases
    // useEffect(() => {
    //     if (packages.length < 1) return;

    //     void initConnection();

    //     PURCHASE_UPDATE_SUBSCRIPTION = purchaseUpdatedListener((purchase: InAppPurchase | SubscriptionPurchase) => {
    //         const receipt = purchase.transactionReceipt;

    //         if (receipt) {
    //             const paidPackage = packages.filter((pack) => pack.app_sku === purchase.productId);
    //             const shortcode = paidPackage.length > 0 ? paidPackage[0].shortcode : '';

    //             // if the code is not specified
    //             if (shortcode === '') {
    //                 return;
    //             }

    //             try {
    //                 dispatch(
    //                     purchaseCredits(
    //                         {
    //                             receipt,
    //                             package: shortcode,
    //                         },
    //                         async () => {
    //                             // API call is a success
    //                             if (Platform.OS === 'ios') {
    //                                 void finishTransactionIOS(purchase.transactionId);
    //                             } else if (Platform.OS === 'android') {
    //                                 // If consumable (can be purchased again)
    //                                 void consumePurchaseAndroid(purchase.purchaseToken);
    //                                 // If not consumable
    //                                 // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
    //                             }

    //                             await finishTransaction(purchase, true);
    //                             await finishTransaction(purchase, false);
    //                         },
    //                         async (response: Response) => {
    //                             // If purchase is already claimed in database
    //                             if (parseInt(response.headers.get('Error') || '', 10) === 400607) {
    //                                 if (Platform.OS === 'ios') {
    //                                     void finishTransactionIOS(purchase.transactionId);
    //                                 } else if (Platform.OS === 'android') {
    //                                     // If consumable (can be purchased again)
    //                                     void consumePurchaseAndroid(purchase.purchaseToken);
    //                                     // If not consumable
    //                                     // RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
    //                                 }
    //                                 await finishTransaction(purchase, true);
    //                                 await finishTransaction(purchase, false);
    //                             }
    //                             // Else, do nothing and try again on next load
    //                         }
    //                     )
    //                 );
    //             } catch (ackErr) {
    //                 /* Do Something */
    //                 void Logger.logError({
    //                     code: 'IAP888',
    //                     description: 'IAP Exception.',
    //                     rawErrorMessage: JSON.stringify(ackErr),
    //                 });
    //             }
    //         } else {
    //             // Retry / conclude the purchase is fraudulent, etc...
    //             void Logger.logError({
    //                 code: 'IAP999',
    //                 description: 'Invalid purchase detected.',
    //                 rawErrorMessage: receipt,
    //             });
    //         }
    //     });
    //     PURCHASE_ERROR_SUBSCRIPTION = purchaseErrorListener((error: PurchaseError) => {
    //         void Logger.logError({
    //             code: 'IAP800',
    //             description: 'In-App purchase error.',
    //             rawErrorCode: error.code,
    //             rawErrorMessage: error.message,
    //         });
    //     });
    //     return (): void => {
    //         if (PURCHASE_UPDATE_SUBSCRIPTION) {
    //             PURCHASE_UPDATE_SUBSCRIPTION.remove();
    //             PURCHASE_UPDATE_SUBSCRIPTION = null;
    //         }
    //         if (PURCHASE_ERROR_SUBSCRIPTION) {
    //             PURCHASE_ERROR_SUBSCRIPTION.remove();
    //             PURCHASE_ERROR_SUBSCRIPTION = null;
    //         }
    //     };
    // }, [dispatch, packages]);

    null;
