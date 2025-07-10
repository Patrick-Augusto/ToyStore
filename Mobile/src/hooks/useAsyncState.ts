import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getErrorMessage } from '../utils/errorHandler';

interface UseAsyncStateOptions<T> {
    initialData?: T;
    onError?: (error: any) => void;
    showAlert?: boolean;
}

interface UseAsyncStateReturn<T> {
    data: T | null;
    loading: boolean;
    error: any;
    execute: (asyncFunction: () => Promise<T>) => Promise<void>;
    reset: () => void;
}

export const useAsyncState = <T = any>(
    options: UseAsyncStateOptions<T> = {}
): UseAsyncStateReturn<T> => {
    const { initialData = null, onError, showAlert = true } = options;

    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const execute = async (asyncFunction: () => Promise<T>) => {
        setLoading(true);
        setError(null);

        try {
            const result = await asyncFunction();
            setData(result);
        } catch (err) {
            setError(err);

            if (onError) {
                onError(err);
            }

            if (showAlert) {
                Alert.alert('Erro', getErrorMessage(err));
            }
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(initialData);
        setLoading(false);
        setError(null);
    };

    return { data, loading, error, execute, reset };
};
