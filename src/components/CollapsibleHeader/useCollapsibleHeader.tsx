import { useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ViewProps } from 'react-native';
import { height } from '../../utilities/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const COLLAPSED_HEIGHT = 56;
export const EXPANDED_HEIGHT = 200;

type CollapsibleHeaderHookValues = {
    scrollProps: {
        ref: React.MutableRefObject<null>;
        contentOffset: {
            x: number;
            y: number;
        };
        scrollEventThrottle: number;
        onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        style: ViewProps['style'];
    };
    headerProps: {
        scrollPosition: Animated.Value;
    };
    contentProps: {
        contentPadding: Animated.Value;
        contentContainerStyle: {
            paddingTop: number;
            paddingBottom: number;
        };
    };
};
export const useCollapsibleHeader = (): CollapsibleHeaderHookValues => {
    const scrollRef = useRef(null);
    const animatedScrollValue = useRef(new Animated.Value(0)).current;
    const contentOffset = { x: 0, y: 0 };
    const [contentPadding] = useState(new Animated.Value(EXPANDED_HEIGHT));
    const insets = useSafeAreaInsets();

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: animatedScrollValue,
                    },
                },
            },
        ],
        {
            useNativeDriver: false,
        }
    );

    return {
        scrollProps: {
            ref: scrollRef,
            contentOffset,
            scrollEventThrottle: 32,
            onScroll: handleScroll,
            style: { zIndex: 1 },
        },
        headerProps: {
            scrollPosition: animatedScrollValue,
        },
        contentProps: {
            contentPadding,
            contentContainerStyle: {
                paddingTop: EXPANDED_HEIGHT + insets.top,
                paddingBottom: height * 0.5,
            },
        },
    };
};
