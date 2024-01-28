import React from 'react';
import { Typography, TypographyProps } from './Typography';

export const SectionTitle: React.FC<TypographyProps<never>> = (props) => (
    <Typography variant={'titleMedium'} fontWeight={'regular'} color={'primary'} uppercase {...props} />
);
