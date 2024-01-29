import React from 'react';
import { useTheme, List, Divider } from 'react-native-paper';
// Components
import { View, FlatList } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { ListItem, Stack, Typography } from '../index';
import { SEButton } from '../SEButton';
import { TutorialModal } from './';
import Carousel from 'react-native-snap-carousel';
// Styles
import { useListStyles, useFlexStyles } from '../../styles';
import { width } from '../../utilities/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { tutorialViewed } from '../../redux/actions';
import { TUTORIALS, TUTORIAL_KEYS } from '../../constants';
import { useAppTheme } from '../../styles/theme';

export const OrderTutorial: React.FC = () => {
    const packages = useSelector((state: ApplicationState) => state.packages.list);
    const showTutorial = useSelector((state: ApplicationState) => state.tutorials);
    const theme = useAppTheme();
    const dispatch = useDispatch();

    const slides = [
        <Stack key={1}>
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Lesson Packages'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {
                    'We offer multiple lesson packages at different price points. Ensure that you have a payment method linked to your phone before purchasing.'
                }
            </Typography>
            <FlatList
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
                data={packages}
                style={{ marginTop: theme.spacing.lg }}
                renderItem={({ item, index }): JSX.Element => (
                    <>
                        {index === 0 && <Divider />}
                        <ListItem
                            title={item.name}
                            description={item.description}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    style={[{ marginRight: -1 * theme.spacing.md }, style]}
                                    {...rightProps}
                                >
                                    <Typography variant={'labelMedium'}>
                                        {packages.length > 0 ? `$${item.price}` : '--'}
                                    </Typography>
                                    {index === 0 && (
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
        </Stack>,
    ];

    return (
        <TutorialModal
            visible={showTutorial.tutorial_order}
            onClose={(): void => {
                // @ts-ignore
                dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.ORDER]));
            }}
        >
            <View>
                <Carousel
                    data={slides}
                    renderItem={({ index }): JSX.Element => slides[index]}
                    sliderWidth={width - 2 * theme.spacing.md}
                    itemWidth={width - 2 * theme.spacing.md}
                />
                <SEButton
                    dark
                    mode={'contained'}
                    uppercase
                    buttonColor={theme.colors.secondary}
                    title="GOT IT"
                    style={{ marginTop: theme.spacing.xl }}
                    onPress={(): void => {
                        // @ts-ignore
                        dispatch(tutorialViewed(TUTORIALS[TUTORIAL_KEYS.ORDER]));
                    }}
                />
            </View>
        </TutorialModal>
    );
};
