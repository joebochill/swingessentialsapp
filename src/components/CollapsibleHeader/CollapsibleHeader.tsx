import React, { JSX, useCallback } from 'react';
import { Animated, ImageSourcePropType, SafeAreaView, View, ViewProps } from 'react-native';
import { Icon, IconProps } from '../Icon';
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT } from './useCollapsibleHeader';
import { useAppTheme } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { interpolate } from '../../utilities';
import { AnimatedImageBackground } from '../Animated';
import { lightType, semiBoldType } from '../../theme/typography/fontConfig';

export type CollapsibleHeaderProps = Pick<ViewProps, 'style'> & {
    /** Array of icons / actions to display on the right */
    actionItems?: IconProps[];

    /**
     * An image to blend with the colored background in the header
     */
    backgroundImage?: ImageSourcePropType;

    /** Icon to show to the left of the title, primarily used to trigger the menu / drawer */
    navigationIcon?: IconProps;

    /**
     * Y-value of the scroll position of the linked ScrollView (dynamic variant only)
     */
    scrollPosition?: Animated.Value;

    /** The text to display on the second line */
    subtitle?: string;

    /** The test to display on the first line */
    title: string;

    /** Custom content to render instead of the text */
    content?: JSX.Element;

    /** height of the expanded Header */
    expandedHeight?: number;
};
export const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = (props) => {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const {
        title,
        subtitle,
        navigationIcon,
        actionItems = [],
        backgroundImage,
        scrollPosition = new Animated.Value(0),
        content,
        expandedHeight = EXPANDED_HEIGHT,
    } = props;
    const dynamicHeaderHeight = Animated.subtract(new Animated.Value(expandedHeight), scrollPosition);
    const getDynamicHeaderHeight = (): Animated.Value | Animated.AnimatedInterpolation<string | number> =>
        dynamicHeaderHeight.interpolate({
            inputRange: [COLLAPSED_HEIGHT, expandedHeight],
            outputRange: [COLLAPSED_HEIGHT + insets.top, expandedHeight + insets.top],
            extrapolate: 'clamp',
        });

    const scaleByHeaderHeight = useCallback(
        (atLarge: number, atSmall: number): number | Animated.AnimatedInterpolation<number> => {
            if (typeof dynamicHeaderHeight === 'number') {
                return interpolate(
                    dynamicHeaderHeight,
                    {
                        min: COLLAPSED_HEIGHT,
                        max: expandedHeight,
                    },
                    {
                        min: atSmall,
                        max: atLarge,
                    }
                );
            }
            return dynamicHeaderHeight.interpolate({
                inputRange: [COLLAPSED_HEIGHT, expandedHeight],
                outputRange: [atSmall, atLarge],
                extrapolate: 'clamp',
            });
        },
        [dynamicHeaderHeight, expandedHeight]
    );

    const collapsedPadding = subtitle ? (COLLAPSED_HEIGHT - 38) / 2 : (expandedHeight - 20) / 2;

    return (
        <Animated.View
            style={{
                width: '100%',
                backgroundColor: theme.colors.primary,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowRadius: 2,
                shadowOpacity: 1,
                elevation: 0,
                paddingTop: 0,
                height: getDynamicHeaderHeight(),
                position: 'absolute',
                zIndex: 1000,
            }}
        >
            <AnimatedImageBackground
                source={backgroundImage}
                resizeMethod={'resize'}
                imageStyle={{ resizeMode: 'cover', opacity: scaleByHeaderHeight(0.3, 0.2) }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
                    <Animated.View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            paddingHorizontal: theme.spacing.md,
                        }}
                    >
                        {navigationIcon && (
                            <Icon
                                {...navigationIcon}
                                size={24}
                                color={theme.colors.onPrimary}
                                containerStyle={{
                                    paddingHorizontal: theme.spacing.sm,
                                    marginRight: theme.spacing.sm,
                                    marginLeft: -1 * theme.spacing.sm,
                                    height: COLLAPSED_HEIGHT,
                                }}
                            />
                        )}
                        {content ? (
                            content
                        ) : (
                            <Animated.View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    marginRight: scaleByHeaderHeight(
                                        0,
                                        actionItems.length * (theme.size.md + theme.spacing.sm)
                                    ),
                                    paddingBottom: scaleByHeaderHeight(theme.spacing.xxl, collapsedPadding),
                                }}
                            >
                                <View
                                    style={{
                                        flex: 0,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Animated.Text
                                        style={{
                                            ...semiBoldType,
                                            color: theme.colors.onPrimary,
                                            lineHeight: scaleByHeaderHeight(30, 20),
                                            fontSize: scaleByHeaderHeight(30, 20),
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                    >
                                        {title}
                                    </Animated.Text>
                                    {subtitle && (
                                        <Animated.Text
                                            style={{
                                                ...lightType,
                                                color: theme.colors.onPrimary,
                                                lineHeight: 18,
                                                fontSize: 18,
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {subtitle}
                                        </Animated.Text>
                                    )}
                                </View>
                            </Animated.View>
                        )}
                        {actionItems.map((action, index) => (
                            <Icon
                                key={index}
                                {...action}
                                size={24}
                                color={theme.colors.onPrimary}
                                containerStyle={{
                                    paddingHorizontal: theme.spacing.sm,
                                    marginLeft: index > 0 ? theme.spacing.sm : 0,
                                    marginRight: index === actionItems.length - 1 ? -1 * theme.spacing.sm : 0,
                                    height: COLLAPSED_HEIGHT,
                                }}
                            />
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </AnimatedImageBackground>
        </Animated.View>
    );
};
