import React, { ComponentType } from 'react';
import { SvgProps } from 'react-native-svg';
import { IconProps } from 'react-native-vector-icons/Icon';

type IconSetArg = {
    IconClass: ComponentType<IconProps>;
    name: string;
};

type BLUIIconArg = {
    IconClass: ComponentType<SvgProps>;
};

type IconArg = IconSetArg | BLUIIconArg;

export type HeaderIcon = {
    /** Name of the icon */
    icon: ComponentType<{ size: number; color: string }>;

    /** Callback when icon is pressed */
    onPress: () => void;
};

const isIconSetArg = (x: IconSetArg | BLUIIconArg): x is IconSetArg => (x as any).name !== undefined;

export const wrapIcon = (arg: IconArg): ((props: { size: number; color: string }) => JSX.Element) => {
    if (isIconSetArg(arg)) {
        const { name, IconClass } = arg;
        return (props: { size: number; color: string }): JSX.Element => (
            <IconClass name={name} color={props.color} size={props.size} testID={'icon'} />
        );
    }
    const { IconClass } = arg;
    return (props: { size: number; color: string }): JSX.Element => (
        <IconClass fill={props.color} width={props.size} height={props.size} testID={'icon'} />
    );
};
