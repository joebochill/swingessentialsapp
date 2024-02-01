import { configureFonts, MD3LightTheme, useTheme } from 'react-native-paper';
import { fontConfig } from './typography/fontConfig';

const purple = {
    0: '#000',
    10: '#0c0a33',
    20: '#151245', // dark
    50: '#4F4C81', // main
    80: '#918fb0', // light
    90: '#bdbcd0',
    95: '#e5e4ec', // 50
    100: '#FFF',
};

export const SETheme = {
    ...MD3LightTheme,
    roundness: 8,
    colors: {
        ...MD3LightTheme.colors,
        primary: purple[50],
        onPrimary: purple[100],
        primaryContainer: purple[95],
        onPrimaryContainer: purple[20],
        secondary: purple[20],
        onSecondary: purple[100],
        // secondaryContainer: '',
        // onSecondaryContainer: '',
        // tertiary: '',
        // onTertiary: '',
        // tertiaryContainer: '',
        // onTertiaryContainer: '',
        background: '#f2f2f2',
        onBackground: purple[20],
        surface: '#FFF',
        onSurface: purple[20],
        surfaceVariant: purple[95],
        onSurfaceVariant: purple[20],
        outline: purple[80],
        error: '#ca3c3d',
        onError: '#FFF',
        errorContainer: '#f9e8e8',
        onErrorContainer: '#000',
        // surfaceDisabled: '',
        // onSurfaceDisabled: '',
        // shadow: '',
        // inverseOnSurface: '',
        // inverseSurface: '',
        // inversePrimary: '',
        // backdrop: '',
        // outlineVariant: '',
        // scrim: '',
        // elevation: {
        //   level0: '',
        //   level1: '',
        //   level2: '',
        //   level3: '',
        //   level4: '',
        //   level5: ''
        // },
    },
    fonts: configureFonts({ config: fontConfig, isV3: true }),
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    size: {
        xs: 8,
        sm: 16,
        md: 24,
        lg: 40,
        xl: 52,
        xxl: 64,
    },
};

export type AppTheme = typeof SETheme;
export const useAppTheme: () => AppTheme = () => useTheme<AppTheme>();
