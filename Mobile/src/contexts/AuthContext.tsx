import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { authService } from '../services/api';

interface AuthProviderProps {
    children: ReactNode;
}

const defaultAuthContext: AuthContextType = {
    isAuthenticated: false,
    token: null,
    login: async () => false,
    loginWithToken: () => { },
    logout: () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            if (storedToken) {
                setToken(storedToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Clear any potentially corrupted auth state
            await clearAuthState();
        } finally {
            setIsLoading(false);
        }
    };

    const clearAuthState = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
            setToken(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error clearing auth state:', error);
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await authService.login(username, password);
            if (response.token) {
                setToken(response.token);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const loginWithToken = async (token: string) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            setToken(token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            await clearAuthState();
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local state
            await clearAuthState();
        }
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        token,
        login,
        loginWithToken,
        logout,
    };

    // Don't render children until auth state is determined
    if (isLoading) {
        return null; // ou um componente de loading
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
