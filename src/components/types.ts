import { ComponentType } from 'react';

export type HeaderIcon = {
    icon: ComponentType<{ size: number; color: string }>;
    onPress: () => void;
};
