import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Switch,
    Alert,
    Share,
} from 'react-native';
import { ToyHeader, ToyCard, Button, ToggleTheme, BarcodeScanner } from '../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { useBackup } from '../hooks/useBackup';
import { useOffline } from '../hooks/useOffline';

const SettingsScreen: React.FC = () => {
    const { colors, mode } = useTheme();
    const [showScanner, setShowScanner] = useState(false);

    const {
        isExporting,
        isImporting,
        createBackup,
        shareBackup,
        importBackup,
        autoBackup,
        setAutoBackup,
        lastBackupTime,
    } = useBackup();

    const {
        isOnline,
        pendingActions,
        syncPendingActions,
        setOnlineStatus,
        hasPendingActions,
        clearPendingActions,
    } = useOffline();

    const handleCreateBackup = async () => {
        try {
            const backup = await createBackup();
            if (backup) {
                Alert.alert(
                    'Backup Criado',
                    'Backup criado com sucesso! Deseja compartilhar?',
                    [
                        { text: 'Não', style: 'cancel' },
                        { text: 'Compartilhar', onPress: shareBackup }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar o backup');
        }
    };

    const handleImportBackup = () => {
        Alert.alert(
            'Importar Backup',
            'Esta ação irá substituir todos os dados atuais. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Continuar',
                    style: 'destructive',
                    onPress: () => {
                        // Aqui você implementaria a seleção de arquivo
                        Alert.alert('Info', 'Funcionalidade de seleção de arquivo será implementada');
                    }
                }
            ]
        );
    };

    const handleBarcodeScan = (code: string) => {
        Alert.alert(
            'Código Escaneado',
            `Código: ${code}`,
            [
                { text: 'OK' },
                {
                    text: 'Buscar Produto',
                    onPress: () => {
                        // Aqui você implementaria a busca do produto
                        Alert.alert('Info', `Buscando produto com código: ${code}`);
                    }
                }
            ]
        );
    };

    const handleSyncData = async () => {
        try {
            await syncPendingActions();
            Alert.alert('Sucesso', 'Dados sincronizados com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível sincronizar os dados');
        }
    };

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return 'Nunca';
        return new Date(timestamp).toLocaleString('pt-BR');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ToyHeader title="Configurações" subtitle="Personalize seu app" />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Tema */}
                <ToyCard title="🎨 Aparência" colorTheme="primary" style={styles.card}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                                Modo Escuro
                            </Text>
                            <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                                Alternar entre tema claro e escuro
                            </Text>
                        </View>
                        <ToggleTheme showLabel={false} size="md" />
                    </View>
                    <Text style={[styles.currentTheme, { color: colors.text.secondary }]}>
                        Tema atual: {mode === 'dark' ? 'Escuro' : 'Claro'}
                    </Text>
                </ToyCard>

                {/* Backup e Dados */}
                <ToyCard title="💾 Backup e Dados" colorTheme="secondary" style={styles.card}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                                Backup Automático
                            </Text>
                            <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                                Criar backup automaticamente
                            </Text>
                        </View>
                        <Switch
                            value={autoBackup}
                            onValueChange={setAutoBackup}
                            trackColor={{ false: colors.gray[300], true: colors.primary }}
                            thumbColor={autoBackup ? colors.white : colors.gray[400]}
                        />
                    </View>

                    {lastBackupTime && (
                        <Text style={[styles.lastBackup, { color: colors.text.secondary }]}>
                            Último backup: {formatDate(lastBackupTime)}
                        </Text>
                    )}

                    <View style={styles.buttonRow}>
                        <Button
                            title="Criar Backup"
                            onPress={handleCreateBackup}
                            loading={isExporting}
                            variant="secondary"
                            size="small"
                            style={styles.halfButton}
                        />
                        <Button
                            title="Importar Backup"
                            onPress={handleImportBackup}
                            loading={isImporting}
                            variant="secondary"
                            size="small"
                            style={styles.halfButton}
                        />
                    </View>
                </ToyCard>

                {/* Funcionalidades Offline */}
                <ToyCard title="🔄 Modo Offline" colorTheme="accent" style={styles.card}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                                Modo Offline
                            </Text>
                            <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                                Trabalhar sem conexão com internet
                            </Text>
                        </View>
                        <Switch
                            value={!isOnline}
                            onValueChange={(value) => {
                                setOnlineStatus(!value);
                                if (value) {
                                    Alert.alert(
                                        'Modo Offline',
                                        'Modo offline ativado. Suas ações serão sincronizadas quando voltar online.'
                                    );
                                } else {
                                    Alert.alert(
                                        'Modo Online',
                                        'Conectado! Sincronizando dados...'
                                    );
                                }
                            }}
                            trackColor={{ false: colors.gray[300], true: colors.accent }}
                            thumbColor={!isOnline ? colors.white : colors.gray[400]}
                        />
                    </View>

                    <View style={[styles.statusContainer, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statusTitle, { color: colors.text.primary }]}>
                            Status da Conexão
                        </Text>
                        <View style={styles.statusRow}>
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: isOnline ? colors.success : colors.error }
                            ]} />
                            <Text style={[styles.statusText, { color: colors.text.secondary }]}>
                                {isOnline ? 'Online' : 'Offline'}
                            </Text>
                        </View>

                        {pendingActions.length > 0 && (
                            <Text style={[styles.pendingText, { color: colors.warning }]}>
                                {pendingActions.length} operação(ões) pendente(s)
                            </Text>
                        )}
                    </View>

                    {pendingActions.length > 0 && isOnline && (
                        <Button
                            title="Sincronizar Dados"
                            onPress={handleSyncData}
                            variant="secondary"
                            size="small"
                        />
                    )}
                </ToyCard>

                {/* Scanner de Código */}
                <ToyCard title="📷 Scanner de Código" colorTheme="success" style={styles.card}>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                        Escaneie códigos de barras para buscar produtos rapidamente
                    </Text>

                    <Button
                        title="Abrir Scanner"
                        onPress={() => setShowScanner(true)}
                        variant="primary"
                        size="medium"
                        style={styles.scannerButton}
                    />
                </ToyCard>

                {/* Sobre o App */}
                <ToyCard title="ℹ️ Sobre o App" style={styles.card}>
                    <View style={styles.aboutContainer}>
                        <Text style={[styles.appName, { color: colors.text.primary }]}>
                            Toy Store App
                        </Text>
                        <Text style={[styles.appVersion, { color: colors.text.secondary }]}>
                            Versão 2.0.0
                        </Text>
                        <Text style={[styles.appDescription, { color: colors.text.secondary }]}>
                            Aplicativo para gerenciamento de loja de brinquedos com funcionalidades avançadas incluindo:
                        </Text>
                        <View style={styles.featuresList}>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Dashboard com gráficos e estatísticas
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Sistema de busca avançada
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Modo escuro/claro
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Funcionalidades offline
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Sistema de backup e importação
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Scanner de código de barras
                            </Text>
                            <Text style={[styles.feature, { color: colors.text.secondary }]}>
                                • Relatórios visuais detalhados
                            </Text>
                        </View>
                    </View>
                </ToyCard>

                {/* Espaço extra no final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Scanner Modal */}
            <BarcodeScanner
                isVisible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleBarcodeScan}
                title="Scanner de Produtos"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    card: {
        margin: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    settingInfo: {
        flex: 1,
        marginRight: SPACING.md,
    },
    settingTitle: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        marginBottom: SPACING.xs,
    },
    settingDescription: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    },
    currentTheme: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    lastBackup: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontStyle: 'italic',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    halfButton: {
        flex: 1,
    },
    statusContainer: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
    },
    statusTitle: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        marginBottom: SPACING.sm,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: SPACING.sm,
    },
    statusText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
    },
    pendingText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    scannerButton: {
        marginTop: SPACING.md,
    },
    aboutContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: TYPOGRAPHY.fontSizes.xl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        marginBottom: SPACING.xs,
    },
    appVersion: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        marginBottom: SPACING.md,
    },
    appDescription: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        textAlign: 'center',
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
        marginBottom: SPACING.md,
    },
    featuresList: {
        alignSelf: 'stretch',
    },
    feature: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        marginBottom: SPACING.xs,
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    },
    bottomSpacing: {
        height: SPACING.xxl,
    },
});

export default SettingsScreen;
