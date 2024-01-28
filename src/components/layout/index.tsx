import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { SectionTitle } from '../typography';
import { useAppTheme } from '../../styles/theme';

/**
 * SPACER COMPONENT
 */
type SpacerFixedProps = {
    size: number;
};
type SpacerFlexProps = {
    flex: number;
};
type SpacerProps = SpacerFixedProps | SpacerFlexProps;
export const Spacer: React.FC<SpacerProps> = (props) => {
    const flex = (props as SpacerFlexProps).flex ?? 0;
    const size = (props as SpacerFixedProps).size;
    return <View style={[{ flex }, flex === 0 && size ? { width: size, height: size } : {}]} />;
};

/**
 *
 * STACK COMPONENT
 *
 */
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


/**
 * SECTION HEADER COMPONENT
 */
type SectionHeaderProps = {
    title: string;
    action?: JSX.Element;
    style?: StyleProp<ViewStyle>;
};
export const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
    const { title, action, style } = props;
    const theme = useAppTheme();
    return (
        <Stack
            direction={'row'}
            align={'center'}
            justify={'space-between'}
            style={[
                { marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
                ...(Array.isArray(style) ? style : [style]),
            ]}
        >
            <SectionTitle>{title}</SectionTitle>
            {action}
        </Stack>
    );
};
