import React from 'react';
import { StyleSheet, Image, ImageProps, ImageSourcePropType } from 'react-native';
import bg from '../images/banners/landing.jpg';

const useStyles = () =>
    StyleSheet.create({
        image: {
            position: 'absolute',
            width: '100%',
            resizeMode: 'cover',
            height: '100%',
            opacity: 0.3,
        },
    });

type BGImageProps = Omit<ImageProps, 'source'> & {
    source?: ImageSourcePropType;
};

export const BackgroundImage: React.FC<BGImageProps> = props => {
    const { style, source = bg, ...other } = props;
    const styles = useStyles();
    return (
        <Image
            source={source}
            resizeMethod={'resize'}
            style={[styles.image, style]}
            {...other}
        />
    );
};

