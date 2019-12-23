import React from 'react';
// Components
import {
    ActivityIndicator,
    Animated,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SEHeader, SEHeaderProps } from './SEHeader';

// Styles
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';

// Constants
import { HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT } from '../../constants';

type HeaderLayoutState = {
    scrollY: Animated.Value;
};
type CollapsibleHeaderLayoutProps = SEHeaderProps & {
    renderScroll?: boolean;
    onRefresh?: Function;
    refreshing?: boolean;
};

// TODO: Allow long titles to wrap to a second line?

export class CollapsibleHeaderLayout extends React.Component<CollapsibleHeaderLayoutProps, HeaderLayoutState> {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }
    render() {
        const { renderScroll = true, children, refreshing = false, onRefresh = () => {} } = this.props;
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);
        return (
            <View style={sharedStyles.pageContainer}>
                <StatusBar barStyle={'light-content'} />
                <SEHeader {...this.props} headerHeight={headerHeight} />
                {renderScroll && (
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        refreshControl={
                            onRefresh ? (
                                <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
                            ) : (
                                undefined
                            )
                        }
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
                        {refreshing && (
                            <ActivityIndicator
                                size={'large'}
                                style={{ marginBottom: spaces.medium, marginTop: -1 * spaces.jumbo }}
                            />
                        )}
                        {children}
                    </ScrollView>
                )}
                {!renderScroll && <View style={[styles.nonScrollContainer]}>{children}</View>}
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
        flex: 1,
    },
});