import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share, Alert } from 'react-native';

export interface BackupData {
    clients: any[];
    stats: any[];
    settings: any;
    timestamp: number;
    version: string;
}

export interface UseBackupReturn {
    isExporting: boolean;
    isImporting: boolean;
    createBackup: () => Promise<string | null>;
    shareBackup: () => Promise<void>;
    importBackup: (backupData: string) => Promise<boolean>;
    autoBackup: boolean;
    setAutoBackup: (enabled: boolean) => void;
    lastBackupTime: number | null;
}

const BACKUP_SETTINGS_KEY = '@toystore_backup_settings';
const LAST_BACKUP_KEY = '@toystore_last_backup';

export const useBackup = (): UseBackupReturn => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [autoBackup, setAutoBackupState] = useState(false);
    const [lastBackupTime, setLastBackupTime] = useState<number | null>(null);

    // Carregar configurações de backup
    const loadBackupSettings = useCallback(async () => {
        try {
            const settings = await AsyncStorage.getItem(BACKUP_SETTINGS_KEY);
            if (settings) {
                const { autoBackup: auto } = JSON.parse(settings);
                setAutoBackupState(auto);
            }

            const lastBackup = await AsyncStorage.getItem(LAST_BACKUP_KEY);
            if (lastBackup) {
                setLastBackupTime(parseInt(lastBackup));
            }
        } catch (error) {
            console.error('Erro ao carregar configurações de backup:', error);
        }
    }, []);

    // Salvar configurações de backup
    const saveBackupSettings = useCallback(async (auto: boolean) => {
        try {
            await AsyncStorage.setItem(BACKUP_SETTINGS_KEY, JSON.stringify({
                autoBackup: auto
            }));
        } catch (error) {
            console.error('Erro ao salvar configurações de backup:', error);
        }
    }, []);

    // Criar backup dos dados
    const createBackup = useCallback(async (): Promise<string | null> => {
        setIsExporting(true);

        try {
            // Simular coleta de dados (substitua pela implementação real)
            const clients = await getStoredData('@clients_data') || [];
            const stats = await getStoredData('@stats_data') || [];
            const settings = await getStoredData('@app_settings') || {};

            const backupData: BackupData = {
                clients,
                stats,
                settings,
                timestamp: Date.now(),
                version: '1.0.0',
            };

            const backupString = JSON.stringify(backupData, null, 2);

            // Salvar timestamp do último backup
            await AsyncStorage.setItem(LAST_BACKUP_KEY, Date.now().toString());
            setLastBackupTime(Date.now());

            console.log('Backup criado com sucesso');
            return backupString;
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            Alert.alert('Erro', 'Não foi possível criar o backup');
            return null;
        } finally {
            setIsExporting(false);
        }
    }, []);

    // Compartilhar backup
    const shareBackup = useCallback(async () => {
        try {
            const backupString = await createBackup();
            if (!backupString) return;

            const filename = `toystore_backup_${new Date().toISOString().split('T')[0]}.json`;

            await Share.share({
                message: backupString,
                title: 'Backup ToyStore',
                url: `data:application/json;charset=utf-8,${encodeURIComponent(backupString)}`,
            }, {
                dialogTitle: 'Compartilhar Backup',
                subject: filename,
            });
        } catch (error) {
            console.error('Erro ao compartilhar backup:', error);
            Alert.alert('Erro', 'Não foi possível compartilhar o backup');
        }
    }, [createBackup]);

    // Importar backup
    const importBackup = useCallback(async (backupData: string): Promise<boolean> => {
        setIsImporting(true);

        try {
            const parsedData: BackupData = JSON.parse(backupData);

            // Validar estrutura do backup
            if (!parsedData.timestamp || !parsedData.version) {
                throw new Error('Formato de backup inválido');
            }

            // Confirmar importação
            Alert.alert(
                'Confirmar Importação',
                `Deseja importar o backup de ${new Date(parsedData.timestamp).toLocaleDateString()}?\n\nEsta ação substituirá todos os dados atuais.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Importar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                // Restaurar dados (substitua pela implementação real)
                                await setStoredData('@clients_data', parsedData.clients);
                                await setStoredData('@stats_data', parsedData.stats);
                                await setStoredData('@app_settings', parsedData.settings);

                                Alert.alert('Sucesso', 'Backup importado com sucesso!');
                                return true;
                            } catch (error) {
                                console.error('Erro durante importação:', error);
                                Alert.alert('Erro', 'Falha ao importar backup');
                                return false;
                            }
                        }
                    }
                ]
            );

            return true;
        } catch (error) {
            console.error('Erro ao importar backup:', error);
            Alert.alert('Erro', 'Arquivo de backup inválido');
            return false;
        } finally {
            setIsImporting(false);
        }
    }, []);

    // Configurar auto backup
    const setAutoBackup = useCallback(async (enabled: boolean) => {
        setAutoBackupState(enabled);
        await saveBackupSettings(enabled);

        if (enabled) {
            // Implementar lógica de backup automático aqui
            console.log('Auto backup habilitado');
        }
    }, [saveBackupSettings]);

    // Funções auxiliares para manipular dados
    const getStoredData = async (key: string) => {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Erro ao buscar dados ${key}:`, error);
            return null;
        }
    };

    const setStoredData = async (key: string, data: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Erro ao salvar dados ${key}:`, error);
            throw error;
        }
    };

    return {
        isExporting,
        isImporting,
        createBackup,
        shareBackup,
        importBackup,
        autoBackup,
        setAutoBackup,
        lastBackupTime,
    };
};
