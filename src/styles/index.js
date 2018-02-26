import { StyleSheet } from 'react-native';

export const colors = {
    white: '#ffffff',
    purple: '#231f61',
    lightPurple: 'rgba(35,31,97,0.8)',
    borderGrey: '#c1c1c1',
    backgroundGrey: '#f0f0f0'
};

export const spacing = {
    extraLarge: 50,
    large: 20,
    normal: 15,
    small: 10,
    tiny: 5
};

export const altStyles = {
    buttonIcon:{
        size: 24,
        color: colors.white,
        style:{marginRight: 0}
    }
};

export default StyleSheet.create({
    purpleButton: {
        backgroundColor: colors.lightPurple,
        height: 50,
        borderColor: colors.purple,
        borderWidth: 2,
        borderRadius: 5,
        marginTop: spacing.normal,
        marginLeft: 0,
        marginRight: 0
    },
    cardHeader:{
        height: 50, 
        paddingLeft: spacing.normal, 
        borderColor: colors.purple, 
        borderWidth: 2, 
        flexDirection:'row', 
        alignItems:'center', 
        backgroundColor: colors.lightPurple    
    },
    cardRow:{
        height: 50, 
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
    }

});