import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body, H7, Label, H4 } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout, ErrorBox, SEButton } from '../../components';
import * as RNIap from 'react-native-iap';

// Styles
import bg from '../../images/bg_5.jpg';
import { sharedStyles } from '../../styles';
import { spaces, unit } from '../../styles/sizes';
import { purple } from '../../styles/colors';

// Redux
import { loadCredits, loadPackages } from '../../redux/actions';

// Constants
import { ROUTES } from '../../constants/routes';

// Types
import { ApplicationState } from '../../__types__';

// Utilities
import { Logger } from '../../utilities/logging';

export const Order = props => {
    const packages = useSelector((state: ApplicationState) => state.packages.list);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const packagesProcessing = useSelector((state: ApplicationState) => state.packages.loading);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();

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
            let skus: Array<string> = [];
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
                        description: `Failed to load in-app purchases.`,
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
                Logger.logError({
                    code: 'IAP200',
                    description: `Failed to request in-app purchase.`,
                    rawErrorCode: error.code,
                    rawErrorMessage: error.message,
                });
            }
            // Purchase response is handled in RNIAPCallbacks.tsx
        },
        [role, roleError.length],
    );

    return (
        <CollapsibleHeaderLayout
            title={'Order Lessons'}
            subtitle={'multiple package options'}
            backgroundImage={bg}
            refreshing={credits.inProgress}
            onRefresh={() => {
                dispatch(loadCredits());
                dispatch(loadPackages());
            }}>
            <ErrorBox
                show={roleError !== ''}
                error={roleError}
                style={{ marginHorizontal: spaces.medium, marginBottom: spaces.medium }}
            />
            {roleError.length === 0 && (
                <View style={styles.callout}>
                    <H4 style={{ lineHeight: 32 }}>{credits.count}</H4>
                    <Label>{`Credit${credits.count !== 1 ? 's' : ''} Remaining`}</Label>
                </View>
            )}
            <View style={[sharedStyles.sectionHeader]}>
                <H7>{'Available Purchases'}</H7>
            </View>
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages}
                extraData={products}
                renderItem={({ item, index }) => (
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        topDivider
                        bottomDivider={index === packages.length - 1}
                        onPress={() => setSelected(index)}
                        leftIcon={{
                            name: parseInt(item.count, 10) === 1 ? 'filter-1' : 'filter-5',
                            color: purple[500],
                            iconStyle: { marginLeft: 0 },
                        }}
                        title={<Body font={'semiBold'}>{item.name}</Body>}
                        subtitle={<Body>{item.description}</Body>}
                        rightTitle={products.length > 0 ? `$${products[index].price}` : '--'}
                        rightIcon={
                            selected === index
                                ? {
                                      name: 'check',
                                      color: purple[500],
                                  }
                                : undefined
                        }
                    />
                )}
                keyExtractor={item => 'package_' + item.app_sku}
            />
            {roleError.length === 0 && !packagesProcessing && !credits.inProgress && (
                <SEButton
                    containerStyle={{ margin: spaces.medium, marginTop: spaces.large }}
                    buttonStyle={{ backgroundColor: purple[400] }}
                    title={<H7 color={'onPrimary'}>PURCHASE</H7>}
                    onPress={() => onPurchase(packages[selected].app_sku, packages[selected].shortcode)}
                />
            )}
        </CollapsibleHeaderLayout>
    );
};

const styles = StyleSheet.create({
    callout: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: purple[50],
        padding: spaces.medium,
        marginBottom: spaces.large,
        borderWidth: unit(1),
        borderRadius: unit(5),
        borderColor: purple[200],
    },
});
