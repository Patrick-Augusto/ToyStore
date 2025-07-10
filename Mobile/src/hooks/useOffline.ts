import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineAction {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    data?: any;
    timestamp: number;
}

export interface UseOfflineReturn {
    isOnline: boolean;
    pendingActions: OfflineAction[];
    queueAction: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => Promise<void>;
    syncPendingActions: () => Promise<void>;
    clearPendingActions: () => Promise<void>;
    hasPendingActions: boolean;
    setOnlineStatus: (status: boolean) => void;
}

const OFFLINE_ACTIONS_KEY = '@toystore_offline_actions';

export const useOffline = (): UseOfflineReturn => {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);

    // Carregar ações pendentes ao inicializar
    useEffect(() => {
        loadPendingActions();
    }, []);

    // Sincronizar automaticamente quando voltar online
    useEffect(() => {
        if (isOnline && pendingActions.length > 0) {
            syncPendingActions();
        }
    }, [isOnline, pendingActions.length]);

    const loadPendingActions = async () => {
        try {
            const stored = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
            if (stored) {
                const actions: OfflineAction[] = JSON.parse(stored);
                setPendingActions(actions);
            }
        } catch (error) {
            console.error('Erro ao carregar ações offline:', error);
        }
    };

    const savePendingActions = async (actions: OfflineAction[]) => {
        try {
            await AsyncStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));
        } catch (error) {
            console.error('Erro ao salvar ações offline:', error);
        }
    };

    const queueAction = useCallback(async (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
        const newAction: OfflineAction = {
            ...action,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };

        const updatedActions = [...pendingActions, newAction];
        setPendingActions(updatedActions);
        await savePendingActions(updatedActions);
    }, [pendingActions]);

    const syncPendingActions = useCallback(async () => {
        if (!isOnline || pendingActions.length === 0) {
            return;
        }

        console.log(`Sincronizando ${pendingActions.length} ações offline...`);

        const successfulActions: string[] = [];
        const failedActions: OfflineAction[] = [];

        for (const action of pendingActions) {
            try {
                // Aqui você implementaria as chamadas reais para a API
                // Por enquanto, vamos simular o sucesso
                await simulateApiCall(action);
                successfulActions.push(action.id);
                console.log(`Ação ${action.type} sincronizada com sucesso:`, action.endpoint);
            } catch (error) {
                console.error(`Erro ao sincronizar ação ${action.id}:`, error);
                failedActions.push(action);
            }
        }

        // Remover ações bem-sucedidas
        const remainingActions = pendingActions.filter(
            action => !successfulActions.includes(action.id)
        );

        setPendingActions(remainingActions);
        await savePendingActions(remainingActions);

        if (successfulActions.length > 0) {
            console.log(`${successfulActions.length} ações sincronizadas com sucesso`);
        }
        if (failedActions.length > 0) {
            console.log(`${failedActions.length} ações falharam na sincronização`);
        }
    }, [isOnline, pendingActions]);

    const clearPendingActions = useCallback(async () => {
        setPendingActions([]);
        await AsyncStorage.removeItem(OFFLINE_ACTIONS_KEY);
    }, []);

    const setOnlineStatus = useCallback((status: boolean) => {
        setIsOnline(status);
    }, []);

    // Simular chamada para API (substitua pela implementação real)
    const simulateApiCall = async (action: OfflineAction): Promise<void> => {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Simular falha ocasional (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Falha na sincronização simulada');
        }

        console.log(`API Call simulada: ${action.type} ${action.endpoint}`, action.data);
    };

    return {
        isOnline,
        pendingActions,
        queueAction,
        syncPendingActions,
        clearPendingActions,
        hasPendingActions: pendingActions.length > 0,
        setOnlineStatus,
    };
};
