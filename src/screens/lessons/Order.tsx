import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { FlatList, Alert } from 'react-native';
import {
    Typography,
    CollapsibleHeaderLayout,
    ErrorBox,
    SEButton,
    OrderTutorial,
    SectionHeader,
    ListItem,
    Stack,
} from '../../components';
import { requestPurchase, useIAP, ErrorCode } from 'react-native-iap';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import bg from '../../images/banners/order.jpg';
import { Divider } from 'react-native-paper';

// Redux
import { loadCredits, loadPackages } from '../../redux/actions';

// Constants
import { ROUTES } from '../../constants/routes';

// Types
import { ApplicationState } from '../../__types__';

// Utilities
import { Logger } from '../../utilities/logging';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';

export const Order: React.FC<StackScreenProps<RootStackParamList, 'Order'>> = (props) => {
    const packages = useSelector((state: ApplicationState) => state.packages.list);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const packagesProcessing = useSelector((state: ApplicationState) => state.packages.loading);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const {
        connected,
        // products,
        // promotedProductsIOS,
        // subscriptions,
        // purchaseHistories,
        // availablePurchases,
        // currentPurchase,
        // currentPurchaseError,
        // initConnectionError,
        // finishTransaction,
        getProducts,
        // getSubscriptions,
        // getAvailablePurchases,
        // getPurchaseHistories,
    } = useIAP();

    const [selected, setSelected] = useState(-1);

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to purchase lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can purchase lessons'
            : '';

    // Load the products from IAP
    useEffect(() => {
        if (packages && connected) {
            try {
                const skus: string[] = [];
                for (let i = 0; i < packages.length; i++) {
                    skus.push(packages[i].app_sku);
                }
                void getProducts({ skus }); // await?
                setSelected(0);
            } catch (err: any) {
                void Logger.logError({
                    code: 'IAP100',
                    description: 'Failed to load in-app purchases.',
                    rawErrorCode: err.code,
                    rawErrorMessage: err.message,
                });
            }
        }
    }, [getProducts, packages, connected]);

    // Purchase Completed
    useEffect(() => {
        if (credits.success) {
            Alert.alert('Purchase Complete', 'Your order has finished processing. Thank you for your purchase!', [
                {
                    text: 'Submit Your Swing Now',
                    onPress: (): void => {
                        // @ts-ignore
                        props.navigation.navigate(ROUTES.SUBMIT);
                    },
                },
                { text: 'Later' },
            ]);
        }
    }, [credits.success, props.navigation]);

    const onPurchase = useCallback(
        async (sku: string, shortcode: string) => {
            if (roleError.length > 0) {
                // logLocalError('137: Purchase request not sent: ' + this.state.error);
                return;
            }
            if (role !== 'customer' && role !== 'administrator') {
                // logLocalError('137XX: Purchase request not sent: ' + this.state.error);
                return;
            }
            if (!sku || !shortcode) {
                // logLocalError('138: Purchase: missing data');
                return;
            }
            try {
                await requestPurchase({
                    sku,
                    // andDangerouslyFinishTransactionAutomaticallyIOS: false,
                });
            } catch (error: any) {
                if (error.code !== ErrorCode.E_USER_CANCELLED) {
                    void Logger.logError({
                        code: 'IAP200',
                        description: 'Failed to request in-app purchase.',
                        rawErrorCode: error.code,
                        rawErrorMessage: error.message,
                    });
                }
            }
            // Purchase response is handled in RNIAPCallbacks.tsx
        },
        [role, roleError.length]
    );

    return (
        <CollapsibleHeaderLayout
            title={'Order More Lessons'}
            subtitle={'Multiple packages available'}
            backgroundImage={bg}
            refreshing={credits.inProgress}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadCredits());
                // @ts-ignore
                dispatch(loadPackages());
            }}
            navigation={props.navigation}
        >
            <ErrorBox
                show={roleError !== ''}
                error={roleError}
                style={{ marginHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}
            />
            {roleError.length === 0 && (
                <Stack
                    align={'center'}
                    style={{
                        marginTop: theme.spacing.md,
                        marginHorizontal: theme.spacing.md,
                        padding: theme.spacing.md,
                        borderWidth: 1,
                        borderRadius: theme.roundness,
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.primaryContainer,
                    }}
                >
                    <Typography variant={'displaySmall'} color={'primary'}>
                        {credits.count}
                    </Typography>
                    <Typography variant={'bodyLarge'} color={'primary'}>{`Credit${
                        credits.count !== 1 ? 's' : ''
                    } Remaining`}</Typography>
                </Stack>
            )}
            <SectionHeader
                title={'Available Packages'}
                style={{ marginTop: theme.spacing.xl, marginHorizontal: theme.spacing.md }}
            />
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages}
                // extraData={products.sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10))}
                renderItem={({ item, index }): JSX.Element => (
                    <>
                        {index === 0 && <Divider />}
                        <ListItem
                            title={item.name}
                            description={item.description}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            onPress={(): void => setSelected(index)}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[{ marginRight: -1 * theme.spacing.md }, style]}
                                    {...rightProps}
                                >
                                    <Typography variant={'labelMedium'}>
                                        {packages.length > 0 ? `${packages[index].price}` : '--'}
                                        {/* {products.length > 0 ? `${products[index].localizedPrice}` : '--'} */}
                                    </Typography>
                                    {selected === index && (
                                        <MatIcon
                                            name={'check'}
                                            size={theme.size.md}
                                            color={theme.colors.primary}
                                            style={{ marginLeft: theme.spacing.sm }}
                                        />
                                    )}
                                </Stack>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => `package_${item.app_sku}`}
            />
            <SEButton
                style={[
                    { margin: theme.spacing.md },
                    roleError.length === 0 && !packagesProcessing && !credits.inProgress ? {} : { opacity: 0.6 },
                ]}
                title={'PURCHASE'}
                onPress={
                    roleError.length === 0 && !packagesProcessing && !credits.inProgress
                        ? (): void => {
                              void onPurchase(packages[selected].app_sku, packages[selected].shortcode);
                          }
                        : undefined
                }
            />
            <OrderTutorial />
        </CollapsibleHeaderLayout>
    );
};
