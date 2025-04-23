import React, { useEffect, useState, useCallback, JSX } from 'react';
import { useSelector } from 'react-redux';
import { Alert, ScrollView, RefreshControl } from 'react-native';
import { ErrorCode } from 'react-native-iap';
import bg from '../../../assets/images/banners/order.jpg';
import { ROUTES } from '../../../navigation/routeConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { Header, useCollapsibleHeader } from '../../layout/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { ErrorBox } from '../../feedback/ErrorBox';
import { SectionHeader } from '../../typography/SectionHeader';
import { Stack } from '../../layout/Stack';
import { Typography } from '../../typography';
import { ListItem } from '../../common/ListItem';
import { SEButton } from '../../common/SEButton';
import { OrderTutorial } from '../../tutorials';
import { Icon } from '../../common/Icon';
import { useGetCreditsQuery } from '../../../redux/apiServices/creditsService';
import { RootState } from '../../../redux/store';
import { LOG } from '../../../logger';
import { useInAppPurchases } from './useInAppPurchases';
import { getErrorMessage } from '../../../redux/apiServices/utils/parseError';

export const Order: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { count: credits = 0 } = {}, refetch: refetchCredits } = useGetCreditsQuery();
    const { products, requestPurchase, isLoading, isSuccess, isError, error, refetchPackages } = useInAppPurchases();

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
                        navigation.navigate(ROUTES.SUBMIT);
                    },
                },
                { text: 'Later' },
            ]);
        }
    }, [isSuccess, navigation]);

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
                if (err.code !== ErrorCode.E_USER_CANCELLED) {
                    LOG.error(`Failed to request in-app purchase: ${err}`, { zone: 'IAP' });
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
                navigation={navigation}
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
                        roleError.length === 0 && products.length > 0 && !isLoading ? {} : { opacity: 0.6 },
                    ]}
                    title={'PURCHASE'}
                    onPress={
                        roleError.length === 0 && products.length > 0 && !isLoading
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
};
