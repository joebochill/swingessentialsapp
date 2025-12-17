import { Typography, TypographyProps } from '@/components/typography/Typography';
import React from 'react';

export const Paragraph: React.FC<TypographyProps<never>> = (props) => (
    <Typography variant={'bodyLarge'} fontWeight={'light'} {...props} />
);
