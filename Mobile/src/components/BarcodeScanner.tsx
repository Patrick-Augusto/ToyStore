import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { Button } from './Button';

interface BarcodeScannerProps {
    isVisible: boolean;
    onClose: () => void;
    onScan: (barcode: string) => void;
    title?: string;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
    isVisible,
    onClose,
    onScan,
    title = "Scanner de Código"
}) => {
    const [manualCode, setManualCode] = useState('');

    const handleManualScan = () => {
        if (manualCode.trim()) {
            onScan(manualCode.trim());
            setManualCode('');
            onClose();
        } else {
            Alert.alert('Erro', 'Digite um código válido');
        }
    };

    const handleSimulatedScan = (code: string) => {
        onScan(code);
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Simulador de câmera */}
                    <View style={styles.cameraContainer}>
                        <View style={styles.cameraView}>
                            <Text style={styles.cameraText}>📷</Text>
                            <Text style={styles.instructionText}>
                                Posicione o código de barras dentro do quadro
                            </Text>

                            {/* Quadro de foco */}
                            <View style={styles.focusFrame} />
                        </View>
                    </View>

                    {/* Códigos de exemplo para teste */}
                    <View style={styles.testSection}>
                        <Text style={styles.sectionTitle}>Códigos de Teste:</Text>
                        <View style={styles.testCodesContainer}>
                            {TEST_BARCODES.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.testCodeButton}
                                    onPress={() => handleSimulatedScan(item.code)}
                                >
                                    <Text style={styles.testCodeText}>{item.name}</Text>
                                    <Text style={styles.testCodeNumber}>{item.code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Input manual */}
                    <View style={styles.manualSection}>
                        <Text style={styles.sectionTitle}>Ou digite manualmente:</Text>
                        <TextInput
                            style={styles.manualInput}
                            value={manualCode}
                            onChangeText={setManualCode}
                            placeholder="Digite o código de barras"
                            keyboardType="numeric"
                        />
                        <Button
                            title="Confirmar Código"
                            onPress={handleManualScan}
                            variant="primary"
                            disabled={!manualCode.trim()}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Códigos de exemplo para teste
const TEST_BARCODES = [
    { name: 'Boneca Barbie', code: '7891234567890' },
    { name: 'Carrinho Hot Wheels', code: '7891234567891' },
    { name: 'Lego Classic', code: '7891234567892' },
    { name: 'Pelúcia Urso', code: '7891234567893' },
    { name: 'Quebra-cabeça 500pç', code: '7891234567894' },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.primary,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.xl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.white,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        color: COLORS.primary,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    cameraView: {
        width: '100%',
        height: 300,
        backgroundColor: COLORS.gray[800],
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cameraText: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    instructionText: {
        color: COLORS.white,
        textAlign: 'center',
        fontSize: TYPOGRAPHY.fontSizes.md,
    },
    focusFrame: {
        position: 'absolute',
        width: 200,
        height: 100,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.sm,
    },
    testSection: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    testCodesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    testCodeButton: {
        backgroundColor: COLORS.secondary,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        minWidth: 140,
        marginBottom: SPACING.sm,
    },
    testCodeText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        color: COLORS.white,
        textAlign: 'center',
    },
    testCodeNumber: {
        fontSize: TYPOGRAPHY.fontSizes.xs,
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.8,
        marginTop: 2,
    },
    manualSection: {
        marginBottom: SPACING.xl,
    },
    manualInput: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: TYPOGRAPHY.fontSizes.md,
        backgroundColor: COLORS.white,
        marginBottom: SPACING.md,
    },
});
