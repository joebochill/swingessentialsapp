import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

export const COLLAPSED_HEIGHT = 56;
export const EXPANDED_HEIGHT = 200;

// const useUpdateScrollView = (
//     contentPaddingValue: number,
//     contentPadding: Animated.Value,
//     animatePadding: (padding: number) => Animated.CompositeAnimation,
//     scrollRef: React.MutableRefObject<any>,
//     scrollValue: number
// ): any =>
//     (data: {
//         padding: number | null;
//         animate: boolean;
//         scrollTo: number | null;
//     }): void => {
//         const { padding, animate, scrollTo } = data;

//         if (padding !== null && padding !== contentPaddingValue) {
//             if (animate) animatePadding(padding).start();
//             else contentPadding.setValue(padding);
//         }
//         // Only update the scroll position if it is not null and is different from the current
//         if (scrollRef && scrollRef.current && scrollTo !== null && scrollTo !== scrollValue) {
//             scrollRef.current.scrollTo({
//                 x: 0,
//                 y: scrollTo,
//                 animated: animate,
//             });
//         }
//     };


export const useCollapsibleHeader = () => {
    const scrollRef = useRef(null);
    const animatedScrollValue = useRef(new Animated.Value(0)).current;
    // const [staticScrollValue, setStaticScrollValue] = useState(0);
    const contentOffset = { x: 0, y: 0 };
    const [contentPadding] = useState(new Animated.Value(EXPANDED_HEIGHT));
    const [staticContentPaddingValue, setStaticContentPaddingValue] = useState(EXPANDED_HEIGHT);
    // Animation function to smoothly animate the paddingTop of ScrollView
    // const animatePadding = (padding: number): Animated.CompositeAnimation =>
    //     Animated.timing(contentPadding, {
    //         toValue: padding,
    //         duration: 300,
    //         useNativeDriver: false,
    //     });

    // Track the scroll position here too so we can minimize unnecessary updates
    // const onScrollChange = useCallback(({ value: scrollDistance }: { value: number }) => {
    //     // console.log('scrollDistance', scrollDistance);
    //     // save the current value of the animated scroll position
    //     setStaticScrollValue(scrollDistance);
    // }, []);

    // Track the padding current (non animated) value so we can minimize unnecessary updates
    const onPaddingChange = useCallback(({ value: newPadding }: { value: number }) => {
        // save the current value of the animated padding
        setStaticContentPaddingValue(newPadding);
    }, []);

    // Set up listeners
    useEffect(() => {
        // const scroll = animatedScrollValue.addListener(onScrollChange);
        const padding = contentPadding.addListener(onPaddingChange);
        return (): void => {
            // animatedScrollValue.removeListener(scroll);
            contentPadding.removeListener(padding);
        };
    }, [onPaddingChange, animatedScrollValue, contentPadding]);

    // This won't be needed for a fixed-dimension header with only one mode and no landscape support
    // const updateScrollView = useUpdateScrollView(
    //     staticContentPaddingValue,
    //     contentPadding,
    //     animatePadding,
    //     scrollRef,
    //     staticScrollValue
    // );

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

    return ({
        scrollProps:{
            ref: scrollRef,
            contentOffset,
            scrollEventThrottle: 32,
            onScroll: handleScroll,
        },
        headerProps: {
            // updateScrollView,
            scrollPosition: animatedScrollValue
        },
        contentProps:{
            contentPadding,
            staticContentPaddingValue
        }
    })
}