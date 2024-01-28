import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { Spacer } from './Spacer';

type StackProps = ViewProps & {
    direction?: ViewStyle['flexDirection'];
    align?: ViewStyle['alignItems'];
    justify?: ViewStyle['justifyContent'];
    wrap?: ViewStyle['flexWrap'];
    space?: number;
};
export const Stack: React.FC<StackProps> = (props) => {
    const {
        direction = 'column',
        align = 'stretch',
        justify = 'flex-start',
        wrap = 'nowrap',
        space = 0,
        style,
        children,
        ...viewProps
    } = props;
    const childrenArray = Array.isArray(children) ? children : [children];
    return (
        <View
            style={[
                {
                    flexDirection: direction,
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap,
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...viewProps}
        >
            {space > 0
                ? childrenArray.map((child, index) => (
                      <React.Fragment key={index}>
                          {index > 0 && <Spacer size={space} />}
                          {child}
                      </React.Fragment>
                  ))
                : children}
        </View>
    );
};
