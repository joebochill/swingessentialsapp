import { Platform } from "react-native";
import { Font } from "react-native-paper/lib/typescript/types";

const regularFont = Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'SFCompactDisplay-Regular',
    android: 'SFCompactDisplay-Regular',
    default: 'SFCompactDisplay-Regular',
});
const mediumFont = Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'SFCompactDisplay-Semibold',
    android: 'SFCompactDisplay-Semibold',
    default: 'SFCompactDisplay-Semibold',
});
const regularType = {
    fontFamily: regularFont,
    letterSpacing: 0,
    fontWeight: '400' as Font['fontWeight'],
};

const mediumType = {
    fontFamily: mediumFont,
    // letterSpacing: 0.15,
    fontWeight: '500' as Font['fontWeight'],
};

export const fontConfig = {
    displayLarge: {
        ...regularType,
        lineHeight: 64,
        fontSize: 57,
    },
    displayMedium: {
        ...regularType,
        lineHeight: 52,
        fontSize: 45,
    },
    displaySmall: {
        ...regularType,
        lineHeight: 44,
        fontSize: 36,
    },

    headlineLarge: {
        ...regularType,
        lineHeight: 40,
        fontSize: 32,
    },
    headlineMedium: {
        ...regularType,
        lineHeight: 36,
        fontSize: 28,
    },
    headlineSmall: {
        ...regularType,
        lineHeight: 32,
        fontSize: 24,
    },

    titleLarge: {
        ...regularType,
        lineHeight: 28,
        fontSize: 22,
    },
    titleMedium: {
        ...mediumType,
        lineHeight: 24,
        fontSize: 16,
    },
    titleSmall: {
        ...mediumType,
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },

    labelLarge: {
        ...mediumType,
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    labelMedium: {
        ...mediumType,
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 12,
    },
    labelSmall: {
        ...mediumType,
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 11,
    },

    bodyLarge: {
        ...regularType,
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        ...regularType,
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
    bodySmall: {
        ...regularType,
        letterSpacing: 0.4,
        lineHeight: 16,
        fontSize: 12,
    },

    default: {
        ...regularType,
    },
};