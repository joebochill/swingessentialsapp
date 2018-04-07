import { StyleSheet } from 'react-native';

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
    extraLarge: 30,
    large: 20,
    normal: 15,
    small: 10,
    tiny: 5
};

export const sizes = {
    extraLarge: 250,
    large: 150,
    medium: 75,
    normal: 50,
    mediumSmall: 30,
    small: 15
}

export const altStyles = {
    buttonIcon:{
        size: 24,
        color: colors.white,
        style:{marginRight: 0}
    }
};

export default StyleSheet.create({
    headerIcon:{
        padding: 15,
        marginLeft: -15,
        marginRight: -15,
        marginBottom: -15
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
        borderWidth: 2,
        borderRadius: 5,
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
        borderWidth: 2, 
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
        borderWidth:1, 
        borderTopWidth: 0,
        alignItems: 'center', 
        backgroundColor: colors.white
    },
    formLabelContainer:{
        // padding: 0, 
        // margin: 0, 
        //height: sizes.small
        //height: 16
        //margin: 0
    },
    formLabel:{
        width: '100%', 
        //height:'100%', 
        color:colors.purple, 
        marginLeft:0, 
        marginTop: 0,
        fontSize: 16
    },
    formInputContainer:{
        backgroundColor: 'blue',
        height: sizes.normal,
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
        borderWidth: 1,
        marginLeft: 0,
        textAlignVertical: 'top'
    },
    formValidationContainer:{
        width: '100%',
        marginLeft: 0,
        padding: 0,
        paddingTop: 0,
        marginTop: spacing.extraLarge
    },
    formValidation:{
        width: '100%',
        marginLeft: 0,
        marginTop: 0,
        padding: spacing.normal,
        backgroundColor: colors.red,
        color: colors.white
    },
    headline:{
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.purple,
        marginBottom: spacing.normal
    },
    paragraph:{
        width: '100%',
        color: colors.purple,
        marginBottom: spacing.tiny
    }

});