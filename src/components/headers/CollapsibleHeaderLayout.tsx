import React, { PropsWithChildren } from 'react';
// Components
import {
    ActivityIndicator,
    Animated,
    Image,
    ImageSourcePropType,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
} from 'react-native';
import { SEHeader, SEHeaderProps } from './SEHeader';

// Styles
import { height } from '../../utilities/dimensions';

// Constants
import { HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT } from '../../constants';
import { withTheme } from 'react-native-paper';
import { AppTheme } from '../../styles/theme';

type HeaderLayoutState = {
    scrollY: Animated.Value;
};
type CollapsibleHeaderLayoutProps = PropsWithChildren<
    SEHeaderProps & {
        renderScroll?: boolean;
        onRefresh?: () => void;
        onResize?: (scroll: Animated.Value) => void;
        refreshing?: boolean;
        bottomPad?: boolean;
        pageBackground?: ImageSourcePropType;
        navigation?: any;
    } & { theme: AppTheme }
>;

class CollapsibleHeaderLayoutRender extends React.Component<CollapsibleHeaderLayoutProps, HeaderLayoutState> {
    constructor(props: CollapsibleHeaderLayoutProps) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }
    render(): JSX.Element {
        const { theme, renderScroll = true, children, refreshing = false, onRefresh, bottomPad = true } = this.props;
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);

        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <StatusBar barStyle={'light-content'} />
                {this.props.pageBackground && (
                    <Image
                        source={this.props.pageBackground}
                        resizeMethod={'resize'}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            resizeMode: 'cover',
                            height: '100%',
                            opacity: 0.15,
                        }}
                    />
                )}
                <SEHeader {...this.props} headerHeight={headerHeight} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {renderScroll && (
                        <ScrollView
                            keyboardShouldPersistTaps={'always'}
                            contentContainerStyle={{
                                paddingTop: HEADER_EXPANDED_HEIGHT,
                                paddingBottom: bottomPad ? height * 0.5 : theme.spacing.md,
                            }}
                            refreshControl={
                                onRefresh ? (
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={(): void => onRefresh()}
                                        progressViewOffset={HEADER_EXPANDED_HEIGHT}
                                    />
                                ) : undefined
                            }
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollY,
                                            },
                                        },
                                    },
                                ],
                                {
                                    listener: () => {
                                        if (this.props.onResize) {
                                            this.props.onResize(this.state.scrollY);
                                        }
                                    },
                                    useNativeDriver: false,
                                }
                            )}
                            scrollEventThrottle={32}
                        >
                            {/* {refreshing && Platform.OS === 'ios' && (
                                <ActivityIndicator
                                    size={'large'}
                                    style={{ marginBottom: theme.spacing.md, marginTop: -1 * theme.spacing.xl }}
                                />
                            )} */}
                            {children}
                        </ScrollView>
                    )}
                    {!renderScroll && <View style={{ flex: 1, marginTop: HEADER_EXPANDED_HEIGHT }}>{children}</View>}
                    <SafeAreaView />
                </KeyboardAvoidingView>
            </View>
        );
    }
    scaleByHeaderHeight(atLarge: number, atSmall: number): Animated.AnimatedInterpolation<number> {
        return this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [atLarge, atSmall],
            extrapolate: 'clamp',
        });
    }
}
export const CollapsibleHeaderLayout = withTheme(CollapsibleHeaderLayoutRender);
