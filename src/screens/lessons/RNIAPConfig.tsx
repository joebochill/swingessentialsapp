import { useEffect } from 'react';
import {
    Purchase,
    PurchaseError,
    clearProductsIOS,
    // endConnection,
    // initConnection,
    purchaseErrorListener,
    purchaseUpdatedListener,
    useIAP,
} from 'react-native-iap';
import { Logger } from '../../utilities/logging';
import { useDispatch, useSelector } from 'react-redux';
import { Platform } from 'react-native';

export const useRNIAP = (): void => {
    const { currentPurchase, currentPurchaseError, finishTransaction } = useIAP();
    const dispatch = useDispatch();
    const packages: any[] = []; //useSelector((state: ApplicationState) => state.packages.list);

    useEffect(() => {
        if (Platform.OS === 'ios') void clearProductsIOS();
    }, []);

    // listen for IAP errors
    useEffect(() => {
        const subscription = purchaseErrorListener((error: PurchaseError) => {
            void Logger.logError({
                code: 'IAP200',
                description: 'Failed to complete in-app purchase.',
                rawErrorCode: error.code,
                rawErrorMessage: error.message,
            });
        });
        return (): void => {
            subscription.remove();
        };
    }, []);

    // listen for IAP purchase updates
    useEffect(() => {
        const subscription = purchaseUpdatedListener((purchase: Purchase) => {
            const receipt = purchase.transactionReceipt;

            if (receipt) {
                const paidPackage = packages.filter((pack) => pack.app_sku === purchase.productId);
                const shortcode = paidPackage.length > 0 ? paidPackage[0].shortcode : '';

                // if the code is not specified
                if (shortcode === '') {
                    return;
                }

                try {
                    // dispatch(
                    //     purchaseCredits(
                    //         {
                    //             receipt,
                    //             package: shortcode,
                    //         },
                    //         () => {
                    //             // API call is a success
                    //             void finishTransaction({ purchase, isConsumable: true });
                    //         },
                    //         (response: Response) => {
                    //             // If purchase is already claimed in database
                    //             if (parseInt(response.headers.get('Error') || '', 10) === 400607) {
                    //                 void finishTransaction({ purchase, isConsumable: true });
                    //             }
                    //             // Else, do nothing and try again on next load
                    //         }
                    //     )
                    // );
                } catch (ackErr) {
                    /* Do Something */
                    void Logger.logError({
                        code: 'IAP888',
                        description: 'IAP Exception.',
                        rawErrorMessage: JSON.stringify(ackErr),
                    });
                }
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                void Logger.logError({
                    code: 'IAP999',
                    description: 'Invalid purchase detected.',
                    rawErrorMessage: receipt,
                });
            }
        });

        return (): void => {
            subscription.remove();
        };
    });

    useEffect(() => {
        // ... listen to currentPurchaseError, to check if any error happened
        void Logger.logError({
            code: 'IAP221',
            description: 'Purchase Error',
            rawErrorCode: currentPurchaseError?.code,
            rawErrorMessage: currentPurchaseError?.message,
        });
    }, [currentPurchaseError]);

    useEffect(() => {
        // ... listen to currentPurchase, to check if the purchase went through
        void Logger.logError({
            code: 'IAP222',
            description: 'Current Purchase Change',
            rawErrorCode: currentPurchase?.productId,
            rawErrorMessage: currentPurchase?.verificationResultIOS,
        });
        // if(!currentPurchase) return;
    }, [currentPurchase]);
};
