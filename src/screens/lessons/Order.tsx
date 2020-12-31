import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, FlatList, Alert } from 'react-native';
import { Body, Label, H4, CollapsibleHeaderLayout, ErrorBox, SEButton, OrderTutorial } from '../../components';
import * as RNIap from 'react-native-iap';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import bg from '../../images/banners/order.jpg';
import { useSharedStyles, useFormStyles, useFlexStyles, useListStyles } from '../../styles';
import { unit } from '../../styles/sizes';
import { useTheme, Subheading, Divider, List } from 'react-native-paper';

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

export const Order: React.FC<StackScreenProps<RootStackParamList, 'Order'>> = (props) => {
    const packages = useSelector((state: ApplicationState) => state.packages.list);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const packagesProcessing = useSelector((state: ApplicationState) => state.packages.loading);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    const [selected, setSelected] = useState(-1);
    const [products, setProducts] = useState<RNIap.Product[]>([]);

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to purchase lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can purchase lessons'
            : '';

    useEffect(() => {
        if (packages) {
            const skus: string[] = [];
            for (let i = 0; i < packages.length; i++) {
                skus.push(packages[i].app_sku);
            }
            const loadProducts = async () => {
                try {
                    await RNIap.initConnection();
                    const verifiedProducts = await RNIap.getProducts(skus);
                    setProducts(verifiedProducts.sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10)));
                    setSelected(0);
                } catch (err) {
                    Logger.logError({
                        code: 'IAP100',
                        description: 'Failed to load in-app purchases.',
                        rawErrorCode: err.code,
                        rawErrorMessage: err.message,
                    });
                }
            };
            loadProducts();
        }
    }, [packages]);

    useEffect(() => {
        if (credits.success) {
            Alert.alert('Purchase Complete', 'Your order has finished processing. Thank you for your purchase!', [
                {
                    text: 'Submit Your Swing Now',
                    onPress: () => {
                        props.navigation.navigate(ROUTES.SUBMIT);
                    },
                },
                { text: 'Later' },
            ]);
        }
    }, [credits.success, props.navigation]);

    const onPurchase = useCallback(
        async (sku, shortcode) => {
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
                await RNIap.requestPurchase(sku, false);
            } catch (error) {
                if (error.code !== RNIap.IAPErrorCode.E_USER_CANCELLED) {
                    Logger.logError({
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
            onRefresh={() => {
                dispatch(loadCredits());
                dispatch(loadPackages());
            }}
            navigation={props.navigation}
        >
            <ErrorBox
                show={roleError !== ''}
                error={roleError}
                style={[formStyles.errorBox, { marginHorizontal: theme.spaces.medium }]}
            />
            {roleError.length === 0 && (
                <View
                    style={[
                        flexStyles.centered,
                        flexStyles.paddingMedium,
                        {
                            flex: 1,
                            borderWidth: unit(1),
                            borderRadius: theme.roundness,
                            marginHorizontal: theme.spaces.medium,
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.light,
                            marginBottom: theme.spaces.jumbo,
                        },
                    ]}
                >
                    <H4 style={{ lineHeight: unit(32) }} color={'primary'}>
                        {credits.count}
                    </H4>
                    <Label color={'primary'}>{`Credit${credits.count !== 1 ? 's' : ''} Remaining`}</Label>
                </View>
            )}
            <View style={[sharedStyles.sectionHeader]}>
                <Subheading style={listStyles.heading}>{'Available Packages'}</Subheading>
            </View>
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages}
                extraData={products}
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.name}
                            description={item.description}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            onPress={() => setSelected(index)}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{products.length > 0 ? `${products[index].localizedPrice}` : '--'}</Body>
                                    {selected === index && (
                                        <MatIcon
                                            name={'check'}
                                            size={theme.sizes.small}
                                            color={theme.colors.accent}
                                            style={{
                                                marginLeft: theme.spaces.small,
                                                marginRight: -1 * theme.spaces.xSmall,
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item) => `package_${item.app_sku}`}
            />
            <SEButton
                style={[
                    formStyles.formField,
                    { margin: theme.spaces.medium },
                    roleError.length === 0 && !packagesProcessing && !credits.inProgress ? {} : { opacity: 0.6 },
                ]}
                title={'PURCHASE'}
                onPress={
                    roleError.length === 0 && !packagesProcessing && !credits.inProgress
                        ? () => onPurchase(packages[selected].app_sku, packages[selected].shortcode)
                        : undefined
                }
            />
            <OrderTutorial />
        </CollapsibleHeaderLayout>
    );
};
