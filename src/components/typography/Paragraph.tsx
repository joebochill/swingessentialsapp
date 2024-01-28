import React from 'react';
import { Typography, TypographyProps } from './Typography';

export const Paragraph: React.FC<TypographyProps<never>> = (props) => (
    <Typography variant={'bodyLarge'} fontWeight={'light'} {...props} />
);
