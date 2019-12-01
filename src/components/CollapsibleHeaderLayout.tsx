import React from 'react';
import { Animated, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SEHeader, PXBHeaderProps } from './';
import { sharedStyles, spaces } from '../styles';

const HEADER_EXPANDED_HEIGHT = 200 + getStatusBarHeight();
const HEADER_COLLAPSED_HEIGHT = 56 + getStatusBarHeight();

type HeaderLayoutState = {
    scrollY: Animated.Value;
};
type CollapsibleHeaderLayoutProps = Exclude<PXBHeaderProps, "headerHeight"> & {
    renderScroll?: boolean;
}

// TODO: Allow long titles to wrap to a second line?

export class CollapsibleHeaderLayout extends React.Component<CollapsibleHeaderLayoutProps, HeaderLayoutState> {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }
    render() {
        const { renderScroll = true, children } = this.props;
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);

        return (
            <View style={sharedStyles.pageContainer}>
                <StatusBar barStyle={'light-content'} />
                <SEHeader
                    {...this.props}
                    dynamic
                    headerHeight={headerHeight}
                />
                {renderScroll &&
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: this.state.scrollY,
                                    },
                                },
                            },
                        ])}
                        scrollEventThrottle={16}>
                        {children}
                    </ScrollView>
                }
                {!renderScroll &&
                    <View style={[styles.nonScrollContainer]}>{children}</View>
                }
                <SafeAreaView />
            </View>
        );
    }
    scaleByHeaderHeight(atLarge: number, atSmall: number) {
        return this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [atLarge, atSmall],
            extrapolate: 'clamp',
        });
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT + spaces.medium,
        paddingBottom: spaces.jumbo,
    },
    nonScrollContainer: {
        marginTop: HEADER_EXPANDED_HEIGHT,
        flex: 1
    }
});
