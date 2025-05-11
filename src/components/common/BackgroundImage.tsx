import React from 'react';
import { ImageBackground, ImageBackgroundProps } from 'react-native';
import bg from '../../assets/images/banners/landing.jpg';
import { useAppTheme } from '../../theme';

export const BackgroundImage: React.FC<ImageBackgroundProps> = (props) => {
    const { style, source = bg, imageStyle, ...other } = props;
    const theme = useAppTheme();
    return (
        <ImageBackground
            source={source}
            style={[
                { flex: 1, backgroundColor: theme.dark ? theme.colors.primaryContainer : theme.colors.primary },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            imageStyle={[{ opacity: 0.3 }, ...(Array.isArray(imageStyle) ? imageStyle : [imageStyle])]}
            {...other}
        />
    );
};
