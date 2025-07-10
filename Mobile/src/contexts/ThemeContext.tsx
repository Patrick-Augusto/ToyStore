import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ThemeColors, getColors } from '../theme';

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_STORAGE_KEY = '@toystore_theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('light');
    const [colors, setColors] = useState<ThemeColors>(getColors('light'));

    // Carregar tema salvo na inicialização
    useEffect(() => {
        loadSavedTheme();
    }, []);

    // Atualizar cores quando o modo mudar
    useEffect(() => {
        setColors(getColors(mode));
        saveTheme(mode);
    }, [mode]);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                setMode(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    };

    const saveTheme = async (themeMode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
        } catch (error) {
            console.error('Erro ao salvar tema:', error);
        }
    };

    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const value: ThemeContextType = {
        mode,
        colors,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};
