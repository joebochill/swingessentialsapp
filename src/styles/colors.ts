// import { BLUIColor } from '@brightlayer-ui/types';

export const transparent = 'transparent';

export const blackOpacity = (opacity: number): string => {
    const op = Math.max(0, Math.min(1, opacity));
    return `rgba(0,0,0,${op})`;
};
export const whiteOpacity = (opacity: number): string => {
    const op = Math.max(0, Math.min(1, opacity));
    return `rgba(255,255,255,${op})`;
};

export const purple = {
    0: '#000',
    10: '#0c0a33',
    20: '#151245', // dark
    50: '#4F4C81', // main
    80: '#918fb0', // light
    90: '#bdbcd0',
    95: '#e5e4ec', // 50
    100:'#FFF',
}

export const old_purple = {
    50: '#e5e4ec',
    100: '#bdbcd0',
    200: '#918fb0',
    300: '#656290',
    400: '#4F4C81', //'#444179',
    500: '#231f61',
    600: '#1f1b59',
    700: '#1a174f',
    800: '#151245',
    900: '#0c0a33',
    // A100: '#726eff',
    // A200: '#413bff',
    // A400: '#0f08ff',
    // A700: '#0700ed',
    contrastDefaultColor: 'light',
};
export const white = {
    50: '#ffffff',
    100: '#fdfdfd',
    200: '#f8f8f8',
    300: '#f5f5f5',
    400: '#f2f2f2',
    500: '#f0f0f0',
    600: '#eeeeee',
    700: '#ececec',
    800: '#e9e9e9',
    900: '#e5e5e5',
    contrastDefaultColor: 'dark',
};
export const red = {
    50: '#f9e8e8',
    100: '#efc5c5',
    200: '#e59e9e',
    300: '#da7777',
    400: '#d2595a',
    500: '#ca3c3d',
    600: '#c53637',
    700: '#bd2e2f',
    800: '#b72727',
    900: '#ab1a1a',
    // A100: '#ff3333',
    // A200: '#ca3c3d',
    // A400: '#bd2e2f',
    // A700: '#ab1a1a',
    contrastDefaultColor: 'light',
};
export const black = {
    50: '#e8eaea',
    100: '#c6cacc',
    200: '#a1a7aa',
    300: '#7b8387',
    400: '#5e696e',
    500: '#424e54',
    600: '#3c474d',
    700: '#333d43',
    800: '#2b353a',
    900: '#1d2529',
    // A100: '#101417',
    // A200: '#181f22',
    // A400: '#0b0e10',
    // A700: '#000000',
    contrastDefaultColor: 'light',
};

export const gray = {
    50: '#eef0f0',
    100: '#d5d8da',
    200: '#b9bfc2',
    300: '#9ca5a9',
    400: '#879196',
    500: '#727e84',
    600: '#6a767c',
    700: '#5f6b71',
    800: '#556167',
    900: '#424e54',
    // A100: '#f0f5fd',
    // A200: '#c2dafe',
    // A400: '#268fca',
    // A700: '#007bc1',
    contrastDefaultColor: 'light',
};
export const oledBlack = {
    50: '#202224',
    100: '#202224',
    200: '#182022',
    300: '#182022',
    400: '#13181b',
    500: '#13181b',
    600: '#0b0e0f',
    700: '#0b0e0f',
    800: '#000000',
    900: '#000000',
    contrastDefaultColor: 'light',
};
export const green = {
    50: '#e7f6e4',
    100: '#c4e9bc',
    200: '#9cdb90',
    300: '#74cc63',
    400: '#57c141',
    500: '#39b620',
    600: '#33af1c',
    700: '#2ca618',
    800: '#249e13',
    900: '#178e0b',
    // A100: '#e8fff1',
    // A200: '#9bffc4',
    // A400: '#4dff96',
    // A700: '#00ff69',
    contrastDefaultColor: 'light',
};

export const orange = {
    50: '#feefe4',
    100: '#fcd6bc',
    200: '#fabb90',
    300: '#f7a064',
    400: '#f68b42',
    500: '#f47721',
    600: '#f36f1d',
    700: '#f16418',
    800: '#ef5a14',
    900: '#ec470b',
    // A100: '#ffefed',
    // A200: '#ffd8d1',
    // A400: '#ffc0b6',
    // A700: '#ffa99a',
    contrastDefaultColor: 'light',
};
