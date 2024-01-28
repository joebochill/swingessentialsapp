import { MD3Theme, configureFonts, MD3LightTheme } from 'react-native-paper';
import { purple } from './colors';
import { fontConfig } from './typography/fontConfig';

export const SETheme: MD3Theme = {
    ...MD3LightTheme,
    roundness: 8,
    colors: {
      ...MD3LightTheme.colors,
      primary: purple[50],
      onPrimary: purple[100],
      primaryContainer: purple[95],
      onPrimaryContainer: purple[20],
      // secondary: '',
      // onSecondary: '',
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
      // surfaceVariant: '',
      // onSurfaceVariant: '',
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
  };

// import { DefaultTheme, MD3Theme, configureFonts } from 'react-native-paper';
// import { white, purple, red, black } from './colors';
// import { spaceUnit, unit } from './sizes';

// type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

// const defaultFontConfig = {
//     extraBold: {
//         // fontFamily: 'SFCompactDisplay-Black'
//     },
//     bold: {
//         // fontFamily: 'SFCompactDisplay-Bold'
//     },
//     semiBold: {
//         fontFamily: 'SFCompactDisplay-Semibold',
//     },
//     medium: {
//         // fontFamily: 'SFCompactDisplay-Semibold'
//     },
//     regular: {
//         // fontFamily: 'SFCompactDisplay-Regular'
//     },
//     light: {
//         fontFamily: 'SFCompactDisplay-Thin',
//     },
//     thin: {
//         // fontFamily: 'SFCompactDisplay-Thin'
//     },
// };
// const fontConfig = {
//     default: defaultFontConfig,
//     ios: defaultFontConfig,
//     android: defaultFontConfig,
// };
// export const theme: MD3Theme = {
//     ...DefaultTheme,
//     dark: false,
//     roundness: 0,
//     // fonts: configureFonts(fontConfig),
//     colors: {
//         ...DefaultTheme.colors,
//         // primary: purple[400],
//         background: white[400],
//         surface: purple[50],
//         // accent: purple[500],
//         error: red[500],
//         // text: purple[500],
//         // placeholder: black[500],
//         onPrimary: white[50],
//         // dark: purple[800],
//         // light: purple[200],
//     },
//     // sizes: {
//     //     xSmall: spaceUnit(3),
//     //     small: spaceUnit(6),
//     //     medium: spaceUnit(8),
//     //     large: spaceUnit(12),
//     //     xLarge: spaceUnit(16),
//     //     jumbo: spaceUnit(24),
//     // },
//     // spaces: {
//     //     xSmall: spaceUnit(1), // 4
//     //     small: spaceUnit(2), // 8
//     //     medium: spaceUnit(4), // 16
//     //     large: spaceUnit(6), // 24
//     //     xLarge: spaceUnit(8), // 32
//     //     jumbo: spaceUnit(12), // 48
//     // },
//     // fontSizes: {
//     //     10: unit(10),
//     //     12: unit(12),
//     //     14: unit(14),
//     //     16: unit(16),
//     //     18: unit(18),
//     //     20: unit(20),
//     //     24: unit(24),
//     //     34: unit(34),
//     //     48: unit(48),
//     //     60: unit(60),
//     //     96: unit(96),
//     // },
// };
// export type Theme = typeof theme;
