import React, { ComponentType } from 'react';

export interface HeaderIcon {
    icon: ComponentType<{ size: number, color: string }>;
    onPress: () => void;
}