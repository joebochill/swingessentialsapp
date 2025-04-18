import { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { useCaptureMobileOrderMutation, useGetPackagesQuery } from '../../redux/apiServices/packagesService';
import { clearActiveOrderID, setActiveOrderID } from '../../redux/slices/ordersSlice';
import { LOG } from '../../utilities/logs';

export const useRNIAP = (): void => {
    const dispatch = useDispatch();
    const { currentPurchase, currentPurchaseError, finishTransaction } = useIAP();
    const [captureMobileOrder, { isSuccess, isError: captureError, error, isLoading: capturing }] =
        useCaptureMobileOrderMutation();
    const { data: packages = [], isLoading: loadingPackages, refetch: refetchPackages } = useGetPackagesQuery();

    const [purchase, setPurchase] = useState<Purchase | null>(null);

    useEffect(() => {
        if (Platform.OS === 'ios') void clearProductsIOS();
    }, []);

    // listen for IAP errors
    useEffect(() => {
        const subscription = purchaseErrorListener((error: PurchaseError) => {
            LOG.error(`Failed to complete in-app purchase (${error.code}): ${error.message}`, { zone: 'IAP' });
        });
        return (): void => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (isSuccess && purchase) {
            // API call is a success
            void finishTransaction({ purchase, isConsumable: true });
            dispatch(clearActiveOrderID());
            setPurchase(null);
        }
    }, [isSuccess, purchase]);

    useEffect(() => {
        if (captureError) {
            // TODO
            // If purchase is already claimed in database
            // if (parseInt(response.headers.get('Error') || '', 10) === 400607) {
            //     void finishTransaction({ purchase, isConsumable: true });
            // }
            // Else, do nothing and try again on next load
        }
    }, [captureError, error]);

    // listen for IAP purchase updates
    useEffect(() => {
        const handleCompleteOrder = async (receipt: string, packageId: number) => {
            const result = await captureMobileOrder({
                orderId: receipt,
                packageId,
            });
            if ('meta' in result) {
                // store the requestID so it can be tracked on orders screen
                dispatch(setActiveOrderID((result.meta as { requestId: string }).requestId));
            }
        };
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
                    setPurchase(purchase);
                    handleCompleteOrder(receipt, paidPackage[0].id);
                } catch (ackErr) {
                    /* Do Something */
                    LOG.error(`IAP encountered an exception: ${JSON.stringify(ackErr)}`, { zone: 'IAP' });
                }
            } else {
                // Retry / conclude the purchase is fraudulent, etc...
                LOG.error(`Invalid purchase detected: ${receipt}`, { zone: 'IAP' });
            }
        });

        return (): void => {
            subscription.remove();
        };
    });

    useEffect(() => {
        // ... listen to currentPurchaseError, to check if any error happened
        if (currentPurchaseError) {
            LOG.error(
                `Failed to complete in-app purchase (${currentPurchaseError.code}): ${currentPurchaseError.message}`,
                { zone: 'IAP' }
            );
        }
    }, [currentPurchaseError]);

    useEffect(() => {
        // ... listen to currentPurchase, to check if the purchase went through
        LOG.info(`Current purchase changed`, {
            zone: 'IAP',
            productID: currentPurchase?.productId,
            verification: currentPurchase?.verificationResultIOS,
        });
        // if(!currentPurchase) return;
    }, [currentPurchase]);
};
