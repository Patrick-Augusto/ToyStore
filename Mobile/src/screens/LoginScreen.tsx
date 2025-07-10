import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { authService } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Button, InputField, ToyCard } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../theme';
import { validateEmail } from '../utils/validation';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const { loginWithToken } = useContext(AuthContext);

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Usuário é obrigatório';
        }

        if (!password.trim()) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 3) {
            newErrors.password = 'Senha deve ter pelo menos 3 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await authService.login(username, password);
            loginWithToken(response.token);
        } catch (error: any) {
            setErrors({
                username: error.response?.data?.error || 'Credenciais inválidas'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.backgroundDecorations}>
                    <View style={[styles.decoration, styles.decoration1]} />
                    <View style={[styles.decoration, styles.decoration2]} />
                    <View style={[styles.decoration, styles.decoration3]} />
                </View>

                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>🧸</Text>
                        <Text style={styles.title}>ToyStore</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        Onde a diversão encontra o gerenciamento!
                    </Text>
                </View>

                <ToyCard style={styles.loginCard}>
                    <Text style={styles.formTitle}>Acesse sua conta</Text>

                    <InputField
                        label="Usuário"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                        }}
                        error={errors.username}
                        placeholder="Digite seu usuário"
                        required
                    />

                    <InputField
                        label="Senha"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        error={errors.password}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        required
                    />

                    <Button
                        title={loading ? "Entrando..." : "Entrar"}
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                        size="large"
                        style={styles.loginButton}
                    />
                </ToyCard>

                <ToyCard colorTheme="secondary" style={styles.hintCard}>
                    <Text style={styles.hintTitle}>Credenciais de Teste</Text>
                    <View style={styles.credentialRow}>
                        <Text style={styles.credentialLabel}>Usuário:</Text>
                        <Text style={styles.credentialValue}>admin</Text>
                    </View>
                    <View style={styles.credentialRow}>
                        <Text style={styles.credentialLabel}>Senha:</Text>
                        <Text style={styles.credentialValue}>admin123</Text>
                    </View>
                </ToyCard>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: SPACING.xl,
    },
    backgroundDecorations: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    decoration: {
        position: 'absolute',
        borderRadius: 50,
        opacity: 0.1,
    },
    decoration1: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.toyBlue,
        top: 50,
        right: 30,
    },
    decoration2: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.toyYellow,
        bottom: 150,
        left: 20,
    },
    decoration3: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.toyGreen,
        top: 200,
        left: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    logoIcon: {
        fontSize: 48,
        marginRight: SPACING.sm,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.xxxl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    loginCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    formTitle: {
        fontSize: TYPOGRAPHY.fontSizes.xl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    loginButton: {
        marginTop: SPACING.md,
    },
    hintCard: {
        marginHorizontal: SPACING.lg,
    },
    hintTitle: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    credentialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.gray[50],
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.xs,
    },
    credentialLabel: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.secondary,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    credentialValue: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.primary,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
});

export default LoginScreen;
