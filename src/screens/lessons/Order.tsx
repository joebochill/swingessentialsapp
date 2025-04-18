import React, { useEffect, useState, useCallback, JSX } from 'react';
import { useSelector } from 'react-redux';
import { Alert, ScrollView, RefreshControl, Platform } from 'react-native';
import { requestPurchase, useIAP, ErrorCode } from 'react-native-iap';
import bg from '../../images/banners/order.jpg';
import { ROUTES } from '../../constants/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { ErrorBox } from '../../components/feedback';
import { SectionHeader, Stack } from '../../components/layout';
import { Typography } from '../../components/typography';
import { ListItem } from '../../components/ListItem';
import { SEButton } from '../../components/SEButton';
import { OrderTutorial } from '../../components/tutorials';
import { Icon } from '../../components/Icon';
import { selectCaptureMobileOrderState, useGetPackagesQuery } from '../../redux/apiServices/packagesService';
import { useGetCreditsQuery } from '../../redux/apiServices/creditsService';
import { RootState } from '../../redux/store';
import { LOG } from '../../utilities/logs';

export const Order: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const role = useSelector((state: RootState) => state.auth.role);
    const { data: packages = [], refetch: refetchPackages } = useGetPackagesQuery();

    const { data: { count: credits = 0 } = {}, refetch: refetchCredits } = useGetCreditsQuery();
    const orderReference = useSelector((state: RootState) => state.order.activeOrderID) ?? '';
    const { isSuccess, isLoading: capturing } = useSelector(selectCaptureMobileOrderState(orderReference));

    const { connected, products, getProducts } = useIAP();

    const syncedPackages = packages.map((p) => ({
        ...p,
        localPrice: products.find((product) => product.productId === p.app_sku)?.localizedPrice ?? '--',
    }));

    const [selected, setSelected] = useState(-1);

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to purchase lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can purchase lessons'
            : '';

    // Load the products from IAP
    useEffect(() => {
        if (packages.length > 0 && connected) {
            try {
                const skus: string[] = [];
                for (let i = 0; i < packages.length; i++) {
                    skus.push(packages[i].app_sku);
                }
                getProducts({ skus }); // await?
                setSelected(0);
            } catch (err: any) {
                LOG.error(`Error loading IAP products: ${err}`, { zone: 'IAP' });
            }
        }
    }, [getProducts, packages, connected]);

    // Purchase Completed
    useEffect(() => {
        if (isSuccess) {
            Alert.alert('Purchase Complete', 'Your order has finished processing. Thank you for your purchase!', [
                {
                    text: 'Submit Your Swing Now',
                    onPress: (): void => {
                        navigation.navigate(ROUTES.SUBMIT);
                    },
                },
                { text: 'Later' },
            ]);
        }
    }, [isSuccess, navigation]);

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
                await requestPurchase(
                    Platform.OS === 'android'
                        ? { skus: [sku] }
                        : { sku, andDangerouslyFinishTransactionAutomaticallyIOS: false }
                );
            } catch (error: any) {
                if (error.code !== ErrorCode.E_USER_CANCELLED) {
                    LOG.error(`Failed to request in-app purchase: ${error}`, { zone: 'IAP' });
                }
            }
            // Purchase response is handled in RNIAPCallbacks.tsx
        },
        [role, roleError.length]
    );

    return (
        <>
            <Header
                title={'Order More Lessons'}
                subtitle={'Multiple packages available'}
                backgroundImage={bg}
                navigation={navigation}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={capturing}
                        onRefresh={(): void => {
                            refetchCredits();
                            refetchPackages();
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
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
                            backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                        }}
                    >
                        <Typography variant={'displaySmall'} color={theme.dark ? 'onPrimary' : 'primary'}>
                            {credits}
                        </Typography>
                        <Typography variant={'bodyLarge'} color={theme.dark ? 'onPrimary' : 'primary'}>{`Credit${
                            credits !== 1 ? 's' : ''
                        } Remaining`}</Typography>
                    </Stack>
                )}
                <SectionHeader
                    title={'Available Packages'}
                    style={{ marginTop: theme.spacing.xl, marginHorizontal: theme.spacing.md }}
                />
                <Stack>
                    {syncedPackages.map((item, index) => (
                        <ListItem
                            key={index}
                            bottomDivider
                            topDivider={index === 0}
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
                                    <Typography variant={'labelMedium'}>{item.localPrice ?? '--'}</Typography>
                                    {selected === index && (
                                        <Icon
                                            name={'check'}
                                            size={theme.size.md}
                                            color={theme.colors.onPrimaryContainer}
                                            style={{ marginLeft: theme.spacing.sm }}
                                        />
                                    )}
                                </Stack>
                            )}
                        />
                    ))}
                </Stack>
                <SEButton
                    style={[
                        { margin: theme.spacing.md },
                        roleError.length === 0 && packages.length > 0 && !capturing ? {} : { opacity: 0.6 },
                    ]}
                    title={'PURCHASE'}
                    onPress={
                        roleError.length === 0 && packages.length > 0 && !capturing
                            ? (): void => {
                                  onPurchase(packages[selected].app_sku, packages[selected].shortcode);
                              }
                            : undefined
                    }
                />
            </ScrollView>
            <OrderTutorial />
        </>
    );
};
