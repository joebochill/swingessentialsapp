import React from 'react';
import { View } from 'react-native';

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
