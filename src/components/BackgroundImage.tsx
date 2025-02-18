import React from 'react';
import { ImageBackground, ImageBackgroundProps } from 'react-native';
import bg from '../images/banners/landing.jpg';

export const BackgroundImage: React.FC<ImageBackgroundProps> = (props) => {
    const { style, source = bg, imageStyle, ...other } = props;
    return (
        <ImageBackground
            source={source}
            style={[{ flex: 1 }, ...(Array.isArray(style) ? style : [style])]}
            imageStyle={[{ opacity: 0.3 }, ...(Array.isArray(imageStyle) ? imageStyle : [imageStyle])]}
            {...other}
        />
    );
};
