import React from 'react';
import { useTheme, List, Divider } from 'react-native-paper';
// Components
import { View, FlatList } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { H7, H4, Body } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
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
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);
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
                    marginTop: theme.spaces.small,
                    marginBottom: theme.spaces.medium,
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
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.name}
                            description={item.description}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body>{packages.length > 0 ? `$${item.price}` : '--'}</Body>
                                    {index === 0 && <MatIcon name={'check'} size={theme.sizes.small} color={theme.colors.accent} style={{ marginLeft: theme.spaces.small, marginRight: -1 * theme.spaces.xSmall }} />}
                                </View>
                            )}
                        />
                        <Divider />
                    </>
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
                    sliderWidth={width - 2 * theme.spaces.medium}
                    itemWidth={width - 2 * theme.spaces.medium}
                />
                <SEButton
                    dark
                    title="GOT IT"
                    style={{ flex: 1, marginTop: theme.spaces.xLarge }}
                    onPress={() => dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.ORDER]))}
                />
            </View>
        </TutorialModal>
    );
};
