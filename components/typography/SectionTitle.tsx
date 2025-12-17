import { Typography, TypographyProps } from '@/components/typography/Typography';
import React from 'react';

export const SectionTitle: React.FC<TypographyProps<never>> = (props) => (
    <Typography variant={'titleMedium'} fontWeight={'regular'} color={'primary'} uppercase {...props} />
);
