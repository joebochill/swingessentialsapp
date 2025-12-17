import { LOG } from '@/logger';
import { useCaptureMobileOrderMutation, useGetPackagesQuery } from '@/redux/apiServices/packagesService';

import { getErrorMessage } from '@/redux/apiServices/utils/parseError';
import { ErrorCode, getAvailablePurchases, PurchaseAndroid, PurchaseIOS, useIAP } from 'expo-iap';
import { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

export const useInAppPurchases = () => {
    const {
        connected,
        products: iapProducts,
        fetchProducts,
        requestPurchase,
        finishTransaction,
    } = useIAP({
        onPurchaseSuccess: async (purchase) => {
            try {
                // Find the package by SKU
                const paidPackage = packages.find((p) => p.app_sku === purchase.productId);
                if (!paidPackage) throw new Error('Package not found for purchase');

                let receipt = '';
                if (Platform.OS === 'ios') {
                    receipt = (purchase as PurchaseIOS).transactionId;
                } else {
                    receipt = (purchase as PurchaseAndroid).dataAndroid ?? '';
                }

                // Validate the receipt on the server
                await captureMobileOrder({
                    orderId: receipt,
                    packageId: paidPackage.id,
                }).unwrap();
            } catch (error) {
                LOG.error(`Failed to capture mobile order: ${getErrorMessage(error)}`, {
                    zone: 'IAP',
                });
            } finally {
                // Even if capture fails, finish the transaction to avoid blocking
                await finishTransaction({
                    purchase,
                    isConsumable: true,
                });
            }
        },
        onPurchaseError: (error) => {
            if (error.code !== ErrorCode.UserCancelled) {
                LOG.error(`Failed to complete in-app purchase (${error.code}): ${error.message}`, { zone: 'IAP' });
            }
        },
    });

    const { data: packages = [], refetch: refetchPackages } = useGetPackagesQuery();
    const [captureMobileOrder, { isError, isSuccess, error, isLoading }] = useCaptureMobileOrderMutation();

    // Fetch IAP products when connected
    useEffect(() => {
        if (connected && packages.length > 0) {
            fetchProducts({ skus: packages.map((p) => p.app_sku), type: 'in-app' });
        }
    }, [connected]);

    const cleanupUnacknowledgedPurchases = useCallback(() => {
        if (Platform.OS === 'android') {
            (async () => {
                try {
                    const availablePurchases = await getAvailablePurchases();
                    for (const purchase of availablePurchases) {
                        if (!(purchase as PurchaseAndroid).isAcknowledgedAndroid) {
                            await finishTransaction({ purchase, isConsumable: true });
                        }
                    }
                } catch (e) {
                    LOG.error('Failed to auto-finish purchase', { zone: 'IAP' });
                }
            })();
        }
    }, [finishTransaction, getAvailablePurchases, Platform]);

    useEffect(() => {
        cleanupUnacknowledgedPurchases();
    }, [cleanupUnacknowledgedPurchases]);

    // Request an IAP Purchase
    const handlePurchase = async (productId: string) => {
        await requestPurchase({
            request: {
                ios: { sku: productId },
                android: { skus: [productId] },
            },
            type: 'in-app',
        });
    };

    // Memoize enrichedPackages to avoid unnecessary recalculations
    const enrichedPackages = useMemo(() => {
        return packages.map((p) => {
            const iapProduct = iapProducts.find((product) => product.id === p.app_sku);
            return {
                ...p,
                localizedPrice: iapProduct ? iapProduct.displayPrice : '--',
            };
        });
    }, [packages, iapProducts]);

    // On load, remove all products which are validated by Apple server
    //   useEffect(() => {
    //     if (Platform.OS === "ios") {
    //       clearProductsIOS();
    //     }
    //   }, []);

    // TODO clear everything for debugging only
    // useEffect(() => {
    //     void clearTransactionIOS();
    // }, []);

    return {
        connected,
        products: enrichedPackages,
        requestPurchase: handlePurchase,
        isLoading,
        isSuccess,
        isError,
        error,
        refetchPackages,
    };
};
