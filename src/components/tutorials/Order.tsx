import React from 'react';
import { useTheme } from 'react-native-paper';
// Components
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

import { H7, H4, Body } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { useSharedStyles } from '../../styles';
import { sizes, spaces } from '../../styles/sizes';
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';

export const OrderTutorial = () => {
    const packages = useSelector((state: ApplicationState) => state.packages.list);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const dispatch = useDispatch();

    const slides = [
        <>
            <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary }}>
                {'Lesson Packages'}
            </H4>
            <H7
                font={'light'}
                style={{
                    textAlign: 'center',
                    marginTop: spaces.small,
                    marginBottom: spaces.medium,
                    color: theme.colors.onPrimary,
                }}>
                {
                    'We offer multiple lesson packages at different price points. Ensure that you have a payment method linked to your phone before purchasing.'
                }
            </H7>
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages}
                ListHeaderComponent={
                    <H7 style={{ color: theme.colors.onPrimary, marginBottom: spaces.xSmall }}>
                        {'Available Packages'}
                    </H7>
                }
                renderItem={({ item, index }) => (
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        topDivider
                        bottomDivider={index === packages.length - 1}
                        leftIcon={{
                            name: parseInt(item.count, 10) === 1 ? 'filter-1' : 'filter-5',
                            color: theme.colors.text,
                            iconStyle: { marginLeft: 0 },
                            size: sizes.small,
                        }}
                        title={
                            <Body font={'semiBold'} style={{ marginLeft: spaces.medium }}>
                                {item.name}
                            </Body>
                        }
                        subtitle={<Body style={{ marginLeft: spaces.medium }}>{item.description}</Body>}
                        rightTitle={<Body>{packages.length > 0 ? `$${item.price}` : '--'}</Body>}
                        rightIcon={
                            index === 0
                                ? {
                                      name: 'check',
                                      color: theme.colors.text,
                                      size: sizes.small,
                                  }
                                : undefined
                        }
                    />
                )}
                keyExtractor={item => 'package_' + item.app_sku}
            />
        </>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_order}
            onClose={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.ORDER]))}>
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }) => slides[index]}
                    sliderWidth={width - 2 * spaces.medium}
                    itemWidth={width - 2 * spaces.medium}
                />
                <SEButton
                    title="GOT IT"
                    style={{ flex: 1, marginTop: spaces.xLarge }}
                    contentStyle={{ backgroundColor: theme.colors.accent }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.ORDER]))}
                />
            </View>
        </TutorialModal>
    );
};
