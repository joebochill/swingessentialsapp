import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SEDarkTheme, SETheme } from '.';
import { Icon, MaterialIconName } from '../components/Icon';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_PREFIX } from '../constants';
import { useColorScheme } from 'react-native';

const ThemeContext = React.createContext({
    toggleTheme: (): void => {},
});
export const useToggleTheme = (): { toggleTheme: () => void } => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchTheme = async () => {
            const savedTheme = await AsyncStorage.getItem(`${ASYNC_PREFIX}themePreference`);
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
            } else {
                setTheme(colorScheme === 'dark' ? 'dark' : 'light');
            }
        };
        fetchTheme();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(`${ASYNC_PREFIX}themePreference`, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    const customIcon = (props: IconProps) => <Icon {...props} name={props.name as MaterialIconName} />;
    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <PaperProvider theme={theme === 'light' ? SETheme : SEDarkTheme} settings={{ icon: customIcon }}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};
