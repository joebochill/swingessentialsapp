import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
// import { unit } from './sizes';
// import { theme as defaultTheme, Theme } from './theme';
import { MD3Theme } from 'react-native-paper';

export const useFormStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    fieldRow: StyleProp<ViewStyle>;
    formField: StyleProp<ViewStyle>;
    inactive: StyleProp<ViewStyle>;
    active: StyleProp<ViewStyle>;
    dashed: StyleProp<ViewStyle>;
    errorBox: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        fieldRow: {
            // marginTop: theme.spaces.large,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        formField: {
            // marginTop: theme.spaces.large,
        },
        inactive: {
            backgroundColor: 'rgba(255,255,255,0.6)',
        },
        active: {
            backgroundColor: theme.colors.onPrimary,
        },
        dashed: {
            borderWidth: 1,
            borderRadius: theme.roundness,
            borderStyle: 'dashed',
            // borderColor: theme.colors.dark,
            backgroundColor: theme.colors.surface,
        },
        errorBox: {
            // paddingVertical: theme.spaces.medium,
            // marginBottom: theme.spaces.medium,
        },
    });

export const useFlexStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    row: StyleProp<ViewStyle>;
    centered: StyleProp<ViewStyle>;
    paddingHorizontal: StyleProp<ViewStyle>;
    paddingMedium: StyleProp<ViewStyle>;
}> =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        centered: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        paddingHorizontal: {
            // paddingHorizontal: theme.spaces.medium,
        },
        paddingMedium: {
            // padding: theme.spaces.medium,
        },
    });

export const useListStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    item: StyleProp<ViewStyle>;
    heading: StyleProp<TextStyle>;
}> =>
    StyleSheet.create({
        item: {
            backgroundColor: theme.colors.onPrimary,
            // paddingHorizontal: theme.spaces.medium,
            alignItems: 'center',
            flexDirection: 'row',
            // minHeight: theme.sizes.xLarge,
        },
        heading: {
            // fontSize: theme.fontSizes[14],
            paddingHorizontal: 0,
            // marginVertical: theme.spaces.small,
            textTransform: 'uppercase',
        },
    });

export const useSharedStyles = (
    theme: MD3Theme
): StyleSheet.NamedStyles<{
    absoluteFull: StyleProp<ViewStyle>;
    border: StyleProp<ViewStyle>;
    centered: StyleProp<ViewStyle>;
    image: StyleProp<ViewStyle>;
    pageContainer: StyleProp<ViewStyle>;
    paragraph: StyleProp<TextStyle>;
    sectionHeader: StyleProp<TextStyle>;
}> =>
    StyleSheet.create({
        absoluteFull: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        border: {
            borderWidth: 1,
            borderRadius: theme.roundness,
            borderColor: theme.colors.primary,
        },
        centered: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
        },
        pageContainer: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        paragraph: {
            // marginTop: theme.spaces.small,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // marginBottom: theme.spaces.medium,
            // marginHorizontal: theme.spaces.medium,
        },
    });
