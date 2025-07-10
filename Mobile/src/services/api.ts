import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants';
import { handleApiError } from '../utils/errorHandler';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor para adicionar token automaticamente
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Error retrieving token from storage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(handleApiError(error));
    }
);

// Response interceptor para tratar erros
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
            // TODO: Implementar redirecionamento para login
        }
        return Promise.reject(handleApiError(error));
    }
);

export const authService = {
    async login(username: string, password: string) {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token } = response.data;
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async logout() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch (error) {
            console.warn('Error removing token from storage:', error);
        }
    },

    async getToken() {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        } catch (error) {
            console.warn('Error retrieving token from storage:', error);
            return null;
        }
    },

    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await this.getToken();
            return !!token;
        } catch (error) {
            return false;
        }
    }
};

export const clientService = {
    async getClients(params?: { name?: string; email?: string; page?: number }) {
        try {
            const response = await api.get('/clients', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async createClient(client: { name: string; email: string; birth_date: string }) {
        try {
            const response = await api.post('/clients', client);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async updateClient(id: number, client: { name: string; email: string; birth_date: string }) {
        try {
            const response = await api.put(`/clients/${id}`, client);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async deleteClient(id: number) {
        try {
            await api.delete(`/clients/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export const statsService = {
    async getSalesByDay() {
        try {
            const response = await api.get('/stats/sales-by-day');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getClientStats() {
        try {
            const response = await api.get('/stats/client-stats');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getGeneralStats() {
        try {
            const response = await api.get('/stats/general');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default api;
