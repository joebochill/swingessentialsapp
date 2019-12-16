import { StyleSheet } from 'react-native';
import { unit, spaces, spaceUnit, fonts, sizes } from './sizes';
import { purple, white } from './colors';

export const sharedStyles = StyleSheet.create({
    absoluteFull: {
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
    formLabel: {
        fontFamily: 'SFCompactDisplay-Regular',
        color: purple[500],
        marginLeft: 0,
        marginTop: 0,
        fontSize: fonts[14],
        fontWeight: '500',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    input: {
        color: purple[500],
        fontSize: fonts[14],
        textAlignVertical: 'center',
        paddingHorizontal: spaces.small,
    },
    inputContainer: {
        height: sizes.large,
        backgroundColor: white[50],
        marginTop: spaces.small,
        padding: spaces.small,
        borderColor: purple[800],
        borderWidth: unit(1),
        borderBottomWidth: unit(1),
        borderRadius: unit(5),
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
    },
});
