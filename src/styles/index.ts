import { StyleSheet } from 'react-native';
import { spaces } from './sizes';

export const sharedStyles = StyleSheet.create({
    textTitle:{
        marginTop: spaces.medium,
    },
    pageContainer:{
        flex: 1,
    },
    paragraph:{
        marginTop: spaces.small,
    },
    paddingMedium:{
        padding: spaces.medium,
    },
});