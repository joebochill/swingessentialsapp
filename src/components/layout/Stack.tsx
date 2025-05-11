import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

type StackProps = ViewProps & {
    direction?: ViewStyle['flexDirection'];
    align?: ViewStyle['alignItems'];
    justify?: ViewStyle['justifyContent'];
    wrap?: ViewStyle['flexWrap'];
    gap?: number;
};
export const Stack: React.FC<StackProps> = (props) => {
    const {
        direction = 'column',
        align = 'stretch',
        justify = 'flex-start',
        wrap = 'nowrap',
        gap = 0,
        style,
        children,
        ...viewProps
    } = props;
    return (
        <View
            style={[
                {
                    flexDirection: direction,
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap,
                    gap,
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...viewProps}
        >
            {children}
        </View>
    );
};
