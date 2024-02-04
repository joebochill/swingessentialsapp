import { useEffect } from 'react';
import {
    Purchase,
    PurchaseError,
    // endConnection,
    // initConnection,
    purchaseErrorListener,
    purchaseUpdatedListener,
    useIAP,
} from 'react-native-iap';
import { Logger } from '../../utilities/logging';

export const useRNIAP = (): void => {
    const {
        // connected,
        // products,
        // promotedProductsIOS,
        // subscriptions,
        // purchaseHistories,
        // availablePurchases,
        currentPurchase,
        currentPurchaseError,
        // initConnectionError,
        finishTransaction,
        // getProducts,
        // getSubscriptions,
        // getAvailablePurchases,
        // getPurchaseHistories,
    } = useIAP();

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
            void finishTransaction({ purchase, isConsumable: true });
        });

        return (): void => {
            subscription.remove();
        };
    });

    useEffect(() => {
        // ... listen to currentPurchaseError, to check if any error happened
    }, [currentPurchaseError]);

    useEffect(() => {
        // ... listen to currentPurchase, to check if the purchase went through
    }, [currentPurchase]);
};
