import bg from '@/assets/images/banners/order.jpg';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { SEButton } from '@/components/common/SEButton';
import { ErrorBox } from '@/components/feedback/ErrorBox';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { OrderTutorial } from '@/components/tutorials/Order';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { useInAppPurchases } from '@/hooks/useInAppPurchases';
import { LOG } from '@/logger';
import { useGetCreditsQuery } from '@/redux/apiServices/creditsService';
import { getErrorMessage } from '@/redux/apiServices/utils/parseError';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { ErrorCode } from 'expo-iap';
import { useRouter } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function OrderScreen() {
    const router = useRouter();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { count: credits = 0 } = {}, refetch: refetchCredits } = useGetCreditsQuery();
    const { connected, products, requestPurchase, isLoading, isSuccess, isError, error, refetchPackages } =
        useInAppPurchases();
    const [selected, setSelected] = useState(-1);

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to purchase lessons.'
            : role === 'pending'
              ? 'You must validate your email address before you can purchase lessons'
              : '';

    useEffect(() => {
        if (products.length > 0) {
            setSelected(0);
        }
    }, [products]);

    // Purchase Completed and Captured
    useEffect(() => {
        if (isSuccess) {
            Alert.alert('Purchase Complete', 'Your order has finished processing. Thank you for your purchase!', [
                {
                    text: 'Submit Your Swing Now',
                    onPress: (): void => {
                        router.push('/(submit)');
                    },
                },
                { text: 'Later' },
            ]);
        }
    }, [isSuccess, router]);

    // Order Capture failed
    useEffect(() => {
        if (isError) {
            if (error) {
                Alert.alert('Purchase Failed', getErrorMessage(error), [
                    {
                        text: 'OK',
                    },
                ]);
            }
        }
    }, [isError, error]);

    const onPurchase = useCallback(
        async (sku: string, shortcode: string) => {
            if (roleError.length > 0) {
                return;
            }
            if (role !== 'customer' && role !== 'administrator') {
                return;
            }
            if (!sku || !shortcode) {
                return;
            }
            try {
                requestPurchase(sku);
            } catch (err: any) {
                if (err.code !== ErrorCode.UserCancelled) {
                    LOG.error(`Failed to request in-app purchase: ${err}`, {
                        zone: 'IAP',
                    });
                }
            }
        },
        [role, roleError.length, requestPurchase]
    );

    return (
        <>
            <Header
                title={'Order More Lessons'}
                subtitle={'Multiple packages available'}
                backgroundImage={bg}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={(): void => {
                            refetchCredits();
                            refetchPackages();
                        }}
                        tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
            >
                <ErrorBox
                    show={roleError !== ''}
                    error={roleError}
                    style={{
                        marginHorizontal: theme.spacing.md,
                        marginTop: theme.spacing.md,
                    }}
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
                        <Typography
                            variant={'bodyLarge'}
                            color={theme.dark ? 'onPrimary' : 'primary'}
                        >{`Credit${credits !== 1 ? 's' : ''} Remaining`}</Typography>
                    </Stack>
                )}
                <SectionHeader
                    title={'Available Packages'}
                    style={{
                        marginTop: theme.spacing.xl,
                        marginHorizontal: theme.spacing.md,
                    }}
                />
                <Stack>
                    {products.map((item, index) => (
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
                                    style={[{ marginRight: -1 * theme.spacing.sm }, style]}
                                    {...rightProps}
                                >
                                    <Typography variant={'labelMedium'}>{item.localizedPrice ?? '--'}</Typography>
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
                        roleError.length === 0 && products.length > 0 && !isLoading && connected
                            ? {}
                            : { opacity: 0.6 },
                    ]}
                    title={'PURCHASE'}
                    onPress={
                        roleError.length === 0 && products.length > 0 && !isLoading && connected
                            ? (): void => {
                                  onPurchase(products[selected].app_sku, products[selected].shortcode);
                              }
                            : undefined
                    }
                />
            </ScrollView>
            <OrderTutorial />
        </>
    );
}
