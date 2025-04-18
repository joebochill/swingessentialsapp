import { useRef } from 'react';
import { Animated, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { height } from '../../../utilities/dimensions';

export const COLLAPSED_HEIGHT = 56;
export const EXPANDED_HEIGHT = 200;

type CollapsibleHeaderHookValues = {
    scrollProps: Pick<ScrollViewProps, 'contentOffset' | 'scrollEventThrottle' | 'onScroll'> & {
        ref: React.MutableRefObject<null>;
    };
    headerProps: {
        scrollPosition: Animated.Value;
    };
    contentProps: {
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
        },
        headerProps: {
            scrollPosition: animatedScrollValue,
        },
        contentProps: {
            contentContainerStyle: {
                paddingTop: EXPANDED_HEIGHT + insets.top,
                paddingBottom: height * 0.5,
            },
        },
    };
};
