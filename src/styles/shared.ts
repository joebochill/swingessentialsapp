import { StyleSheet } from 'react-native';
import { spaces, spaceUnit } from './sizes';

export const sharedStyles = StyleSheet.create({
    textTitle: {
        marginTop: spaces.medium,
    },
    listItem:{
        paddingHorizontal: spaces.medium, 
        paddingVertical: 0,
    },
    listItemContent:{
        height: spaceUnit(14),
    },
    disabled:{
        opacity: 0.7,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    paragraph: {
        marginTop: spaces.small,
    },
    paddingMedium: {
        padding: spaces.medium,
        paddingBottom: spaces.jumbo,
    },
    paddingHorizontalMedium:{
        paddingHorizontal: spaces.medium,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: spaces.small,
        marginHorizontal: spaces.medium,
    }
});