import React from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';
import bg from '../images/banners/landing.jpg';

type BGImageProps = Omit<ImageProps, 'source'> & {
    source?: ImageSourcePropType;
};

export const BackgroundImage: React.FC<BGImageProps> = (props) => {
    const { style, source = bg, ...other } = props;
    // @ts-ignore
    return (
        <Image
            source={source}
            resizeMethod={'resize'}
            style={[
                {
                    position: 'absolute',
                    width: '100%',
                    resizeMode: 'cover',
                    height: '100%',
                    opacity: 0.3,
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...other}
        />
    );
};
