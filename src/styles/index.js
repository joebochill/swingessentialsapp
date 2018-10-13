import React from 'react';
import { StyleSheet } from 'react-native';
import {scale} from './dimension';

export const colors = {
    white: '#ffffff',
    purple: '#231f61',
    lightPurple: 'rgba(35,31,97,0.8)',
    veryLightPurple: 'rgba(35,31,97,0.6)',
    borderGrey: '#c1c1c1',
    backgroundGrey: '#f0f0f0',
    red: '#ff3333',
    black: '#0f0f0f',
    transparent: 'transparent'
};

export const spacing = {
    extraLarge: scale(30),
    large: scale(20),
    normal: scale(15),
    small: scale(10),
    tiny: scale(5)
};

export const sizes = {
    extraLarge: scale(250),
    large: scale(150),
    medium: scale(75),
    normal: scale(50),
    mediumSmall: scale(30),
    small: scale(15),
    tiny: scale(5)
}

export const defaultFont = {
    fontSize: scale(14),
    color: '#231f61'
}

export const altStyles = {
    buttonIcon:{
        size: scale(24),
        color: colors.white,
        style:{marginRight: 0}
    }
};

export default StyleSheet.create({
    headerIcon:{
        padding: scale(15),
        marginLeft: scale(-15),
        marginRight: scale(-15),
        marginBottom: scale(-15)
    },
    buttonContainer:{
        width: '100%', 
        flex: 0, 
        marginLeft: 0
    },
    purpleButton: {
        backgroundColor: colors.lightPurple,
        height: sizes.normal,
        borderColor: colors.purple,
        borderWidth: scale(2),
        borderRadius: scale(5),
        marginTop: spacing.normal,
        marginLeft: 0,
        marginRight: 0
    },
    linkButton: {
        backgroundColor: colors.transparent,
        paddingLeft: 0,
        paddingRight:0,
        paddingTop: spacing.small,
        paddingBottom: spacing.small
    },
    disabledButton:{
        backgroundColor: colors.lightPurple,
        opacity: 0.5
    },
    disabledButtonAlt:{
        backgroundColor: colors.backgroundGrey,
        // opacity: 0.5
    },
    cardHeader:{
        height: sizes.normal, 
        paddingLeft: spacing.normal, 
        paddingRight: spacing.normal,
        borderColor: colors.purple, 
        borderWidth: scale(2), 
        flexDirection:'row', 
        alignItems:'center', 
        backgroundColor: colors.lightPurple
    },
    cardRow:{
        height: sizes.normal, 
        paddingLeft: spacing.normal, 
        paddingRight: spacing.normal,
        flexDirection: 'row', 
        alignItems: 'center',
        // justifyContent: 'space-between',
        borderColor: colors.borderGrey, 
        borderWidth:scale(1), 
        borderTopWidth: 0,
        alignItems: 'center', 
        backgroundColor: colors.white
    },
    formLabel:{
        width: '100%', 
        //height:'100%', 
        color:colors.purple, 
        marginLeft:0, 
        marginTop: 0,
        fontSize: scale(16),
        fontWeight: 'bold'
    },
    formInputContainer:{
        backgroundColor: 'blue',
        height: sizes.normal,//scale(sizes.normal),
        width: '100%',
        marginLeft: 0
    },
    formInput:{
        width: '100%',
        height: '100%',
        paddingLeft: spacing.normal,
        paddingRight: spacing.normal,
        color: colors.purple,
        backgroundColor: colors.white,
        borderColor: colors.borderGrey,
        borderWidth: scale(1),
        marginLeft: 0,
        textAlignVertical: 'center',
        fontSize: scale(14)
    },
    formValidation:{
        width: '100%',
        margin: 0,
        padding: spacing.normal,
        backgroundColor: colors.red,
        color: colors.white,
        fontSize: scale(14)
    },
    headline:{
        width: '100%',
        textAlign: 'center',
        fontSize: scale(18),
        fontWeight: 'bold',
        color: colors.purple,
        marginBottom: spacing.normal
    },
    paragraph:{
        width: '100%',
        color: colors.purple,
        marginBottom: spacing.normal,
        fontSize: scale(14)
    },
    absolute:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    centered:{
        alignItems: 'center',
        justifyContent: 'center'
    }
});