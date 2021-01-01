import { StyleSheet } from 'react-native';
import { unit } from './sizes';
import { theme as defaultTheme } from './theme';

export const useFormStyles = (theme: ReactNativePaper.Theme = defaultTheme) =>
    StyleSheet.create({
        fieldRow: {
            marginTop: theme.spaces.large,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        formField: {
            marginTop: theme.spaces.large,
        },
        inactive: {
            backgroundColor: 'rgba(255,255,255,0.6)',
        },
        active: {
            backgroundColor: theme.colors.onPrimary,
        },
        dashed: {
            borderWidth: unit(1),
            borderRadius: theme.roundness,
            borderStyle: 'dashed',
            borderColor: theme.colors.dark,
            backgroundColor: theme.colors.surface,
        },
        errorBox: {
            paddingVertical: theme.spaces.medium,
            marginBottom: theme.spaces.medium,
        },
    });

export const useFlexStyles = (theme: Theme = defaultTheme) =>
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
            paddingHorizontal: theme.spaces.medium,
        },
        paddingMedium: {
            padding: theme.spaces.medium,
        },
    });

export const useListStyles = (theme: Theme = defaultTheme) =>
    StyleSheet.create({
        item: {
            backgroundColor: theme.colors.onPrimary,
            paddingHorizontal: theme.spaces.medium,
            alignItems: 'center',
            flexDirection: 'row',
            minHeight: theme.sizes.xLarge,
        },
        heading: {
            fontSize: theme.fontSizes[14],
            paddingHorizontal: 0,
            marginVertical: theme.spaces.small,
            textTransform: 'uppercase',
        },
    });

export const useSharedStyles = (theme: Theme = defaultTheme) =>
    StyleSheet.create({
        absoluteFull: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        border: {
            borderWidth: unit(1),
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
            marginTop: theme.spaces.small,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spaces.medium,
            marginHorizontal: theme.spaces.medium,
        },
    });
