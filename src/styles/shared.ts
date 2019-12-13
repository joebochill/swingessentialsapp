import { StyleSheet } from 'react-native';
import { unit, spaces, spaceUnit } from './sizes';
import { purple, white } from './colors';

export const sharedStyles = StyleSheet.create({
    absoluteFull:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    border: {
        borderWidth: unit(2),
        borderRadius: unit(5),
        borderColor: purple[800],
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashed: {
        borderWidth: unit(2),
        borderRadius: unit(5),
        borderStyle: 'dashed',
        borderColor: purple[800],
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    textTitle: {
        marginTop: spaces.medium,
    },
    listItem: {
        paddingHorizontal: spaces.medium,
        paddingVertical: 0,
    },
    listItemContent: {
        height: spaceUnit(14),
    },
    disabled: {
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
    paddingHorizontalMedium: {
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