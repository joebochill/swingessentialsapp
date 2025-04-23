import { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import {
    requestPurchase,
    useIAP,
    clearProductsIOS,
    // clearTransactionIOS,
} from 'react-native-iap';
import { useCaptureMobileOrderMutation, useGetPackagesQuery } from '../../../redux/apiServices/packagesService';
import { LOG } from '../../../logger';
import { getErrorMessage } from '../../../redux/apiServices/utils/parseError';

export const useInAppPurchases = () => {
    const { products: iapProducts, currentPurchase, currentPurchaseError, finishTransaction, getProducts } = useIAP();

    const { data: packages = [], refetch: refetchPackages } = useGetPackagesQuery();
    const [captureMobileOrder, { isLoading, isSuccess, isError, error }] = useCaptureMobileOrderMutation();

    // Memoize enrichedPackages to avoid unnecessary recalculations
    const enrichedPackages = useMemo(() => {
        return packages.map((p) => {
            const iapProduct = iapProducts.find((product) => product.productId === p.app_sku);
            return {
                ...p,
                localizedPrice: iapProduct ? iapProduct.localizedPrice : '',
            };
        });
    }, [packages, iapProducts]);

    // On load, remove all products which are validated by Apple server
    useEffect(() => {
        if (Platform.OS === 'ios') {
            clearProductsIOS();
        }
    }, []);

    // TODO clear everything for debugging only
    // useEffect(() => {
    //     void clearTransactionIOS();
    // }, []);

    // Load the IAP Product data once we have the packages list from the server
    useEffect(() => {
        if (packages.length > 0) {
            getProducts({ skus: packages.map((p) => p.app_sku) });
        }
    }, [packages, getProducts]);

    // Listen for IAP Purchase errors
    useEffect(() => {
        if (currentPurchaseError) {
            LOG.error(
                `Failed to complete in-app purchase (${currentPurchaseError.code}): ${currentPurchaseError.message}`,
                { zone: 'IAP' }
            );
        }
    }, [currentPurchaseError]);

    // Listen for Order Capture errors
    useEffect(() => {
        if (isError) {
            LOG.error(`Failed to capture mobile order: ${getErrorMessage(error)}`, { zone: 'IAP' });

            // If purchase is already claimed in database
            const err = error as { status: number; data: { message: string } };
            if (err?.status === 400 && err?.data?.message === 'Receipt already claimed') {
                if (currentPurchase) {
                    finishTransaction({ purchase: currentPurchase, isConsumable: true });
                }
            }
        }
    }, [isError, error, currentPurchase, finishTransaction]);

    // Listen for Order Capture success
    useEffect(() => {
        if (isSuccess && currentPurchase) {
            // API call is a success
            try {
                finishTransaction({ purchase: currentPurchase, isConsumable: true });
            } catch (err) {
                LOG.error(`Order succeeded, but failed to finish transaction: ${getErrorMessage(err)}`, {
                    zone: 'IAP',
                });
            }
        }
    }, [isSuccess, currentPurchase, finishTransaction]);

    // Listen for purchases to capture
    useEffect(() => {
        if (!currentPurchase) {
            return;
        }

        const captureOrder = async (receipt: string, packageId: number) => {
            await captureMobileOrder({
                orderId: receipt,
                packageId,
            });
        };

        if (currentPurchase.transactionReceipt) {
            // Purchase was a success
            const paidPackage = packages.filter((pack) => pack.app_sku === currentPurchase.productId);

            try {
                captureOrder(currentPurchase.transactionReceipt, paidPackage[0].id);
            } catch (err) {
                LOG.error(`Order succeeded, but capture failed: ${getErrorMessage(err)}`, { zone: 'IAP' });
            }
        }
    }, [currentPurchase, captureMobileOrder, packages]);

    // Tell IAP to initiate a purchase
    const initiatePurchase = async (sku: string) => {
        await requestPurchase(
            Platform.OS === 'android'
                ? { skus: [sku] }
                : { sku, andDangerouslyFinishTransactionAutomaticallyIOS: false }
        );
    };

    return {
        products: enrichedPackages,
        requestPurchase: initiatePurchase,
        isLoading,
        isSuccess,
        isError,
        error,
        refetchPackages,
    };
};
