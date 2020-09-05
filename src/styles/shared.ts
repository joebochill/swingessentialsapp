import { StyleSheet } from 'react-native';
import { unit, spaces, spaceUnit, fonts, sizes } from './sizes';
import { white } from './colors';
import { theme as defaultTheme } from './theme';

export const useFormStyles = (theme = defaultTheme) => StyleSheet.create({
    fieldRow: {
        marginTop: spaces.large,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    formField: {
        marginTop: spaces.large,
    },
    inactive: {
        backgroundColor: 'rgba(255,255,255,0.6)'
    },
    active: {
        backgroundColor: theme.colors.onPrimary,
    },
})

export const useSharedStyles = (theme = defaultTheme) => StyleSheet.create({
    absoluteFull: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // used in Counter and Record
    },
    border: {
        borderWidth: unit(2),
        borderRadius: theme.roundness,
        borderColor: theme.colors.dark, //dark,
        // Used in token modal and up;oad progress modal
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashed: {
        borderWidth: unit(2),
        borderRadius: theme.roundness,
        borderStyle: 'dashed',
        borderColor: theme.colors.dark, //dark,
        // Used in Submit and SEVideo
    },
    // formLabel: {
    //     fontFamily: 'SFCompactDisplay-Regular',
    //     color: theme.colors.accent, //[500],
    //     marginLeft: 0,
    //     marginTop: 0,
    //     fontSize: theme.fontSizes[14],
    //     fontWeight: '500',
    // },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
        // Used in submit and submit tutorial
    },
    // input: {
    //     color: theme.colors.accent, //accent,
    //     fontSize: theme.fontSizes[14],
    //     textAlignVertical: 'center',
    //     paddingHorizontal: theme.spaces.small,
    // },
    // inputContainer: {
    //     // height: sizes.large,
    //     // backgroundColor: white[50],
    //     // marginTop: spaces.small,
    //     // padding: spaces.small,
    //     // borderColor: theme.colors.dark, //dark,
    //     // borderWidth: unit(1),
    //     // borderBottomWidth: unit(1),
    //     // borderRadius: unit(5),
    // },
    textTitle: {
        marginTop: theme.spaces.medium,
        // used in About FAQ and Single Lesson
    },
    listItem: {
        paddingHorizontal: theme.spaces.medium,
        paddingVertical: 0,
        // Used a LOT
    },
    listItemContent: {
        height: spaceUnit(14),
        // Used a LOT
    },
    disabled: {
        opacity: 0.7,
        // Only used on Home
    },
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        // Used across multiple pages
    },
    paragraph: {
        marginTop: theme.spaces.small,
        // Used in About FAAQ, Singles
    },
    paddingMedium: {
        padding: theme.spaces.medium,
        paddingBottom: theme.spaces.jumbo,
        // Used in several places
    },
    paddingHorizontalMedium: {
        paddingHorizontal: theme.spaces.medium,
        // used in several places
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: theme.spaces.small,
        marginHorizontal: theme.spaces.medium,
        // Used in several places
    },
});
