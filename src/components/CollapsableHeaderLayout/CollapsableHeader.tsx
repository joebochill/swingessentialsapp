import { Animated, ImageBackground, ImageSourcePropType, Platform, StatusBar, ViewProps } from "react-native";
import { AnimatedSafeAreaView, Icon, IconProps, Typography } from ".."
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT } from "./useCollapsibleHeader";
import { useAppTheme } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback } from "react";
import { interpolate } from "../../utilities";



type HeaderProps = ViewProps['style'] & {
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
};
export const CollapsibleHeader: React.FC<HeaderProps> = (props) => {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const { title, subtitle, navigationIcon, actionItems = [], backgroundImage, scrollPosition = new Animated.Value(0), content } = props;
    const dynamicHeaderHeight = Animated.subtract(new Animated.Value(EXPANDED_HEIGHT), scrollPosition);
    const getDynamicHeaderHeight = (): Animated.Value | Animated.AnimatedInterpolation<string | number> =>
        dynamicHeaderHeight.interpolate({
            inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
            outputRange: [COLLAPSED_HEIGHT + insets.top, EXPANDED_HEIGHT + insets.top],
            extrapolate: 'clamp',
        });

    const scaleByHeaderHeight = useCallback((atLarge: number, atSmall: number): (number | Animated.AnimatedInterpolation<number>) => {
        if (typeof dynamicHeaderHeight === 'number') {
            return interpolate(
                dynamicHeaderHeight,
                {
                    min: COLLAPSED_HEIGHT,
                    max: EXPANDED_HEIGHT,
                },
                {
                    min: atSmall,
                    max: atLarge,
                }
            );
        }
        return dynamicHeaderHeight.interpolate({
            inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
            outputRange: [atSmall, atLarge],
        });
    }, [dynamicHeaderHeight]);

    const collapsedPadding = subtitle ? (COLLAPSED_HEIGHT - 38) / 2 : (EXPANDED_HEIGHT - 20) / 2;

    return (
        <AnimatedSafeAreaView
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
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                height: getDynamicHeaderHeight(),
                position: 'absolute',
                zIndex: 100,
            }}
        >
            <ImageBackground
                source={backgroundImage}
                resizeMethod={'resize'}
                imageStyle={{ resizeMode: 'cover' }}
            >
                {content ? content :
                    <Animated.View style={{
                        flexDirection: 'row',
                        paddingHorizontal: theme.spacing.md,
                        paddingBottom: scaleByHeaderHeight(theme.spacing.xxl, collapsedPadding)
                    }}>
                        {navigationIcon && <Icon {...navigationIcon} />}
                        <Typography>{title}</Typography>
                        {actionItems.map((action) => (
                            <Icon {...action} />
                        ))}

                    </Animated.View>
                }
            </ImageBackground>

        </AnimatedSafeAreaView>
    )
}