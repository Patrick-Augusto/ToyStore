import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { clientService } from '../services/api';
import { Client } from '../types';
import { ClientsStackParamList } from '../types/navigation';
import { ToyHeader, ToyCard, Button, InputField } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { validateEmail, formatDate } from '../utils/validation';

type AddEditClientScreenRouteProp = RouteProp<ClientsStackParamList, 'AddEditClient'>;
type AddEditClientScreenNavigationProp = StackNavigationProp<ClientsStackParamList, 'AddEditClient'>;

const AddEditClientScreen = () => {
    const navigation = useNavigation<AddEditClientScreenNavigationProp>();
    const route = useRoute<AddEditClientScreenRouteProp>();
    const client = route.params?.client;
    const isEditing = !!client;

    const [name, setName] = useState(client?.name || '');
    const [email, setEmail] = useState(client?.email || '');
    const [birthDate, setBirthDate] = useState(client?.birthDate || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; birthDate?: string }>({});

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; birthDate?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(email.trim())) {
            newErrors.email = 'Email inválido';
        }

        if (!birthDate.trim()) {
            newErrors.birthDate = 'Data de nascimento é obrigatória';
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(birthDate)) {
                newErrors.birthDate = 'Formato de data inválido (AAAA-MM-DD)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const clientData = {
                name: name.trim(),
                email: email.trim(),
                birth_date: birthDate,
            };

            if (isEditing && client) {
                await clientService.updateClient(client.id, clientData);
                Alert.alert('Sucesso!', 'Cliente atualizado com sucesso!');
            } else {
                await clientService.createClient(clientData);
                Alert.alert('Sucesso!', 'Cliente criado com sucesso!');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving client:', error);
            Alert.alert('Erro', 'Erro ao salvar cliente. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ToyHeader
                title={isEditing ? "Editar Cliente" : "Novo Cliente"}
                subtitle={isEditing ? "Atualize as informações" : "Adicione um novo cliente"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ToyCard title={isEditing ? "Editar Informações" : "Dados do Cliente"}>
                    <InputField
                        label="Nome Completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        error={errors.name}
                        placeholder="Digite o nome completo"
                        autoCapitalize="words"
                        required
                    />

                    <InputField
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        error={errors.email}
                        placeholder="exemplo@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />

                    <InputField
                        label="Data de Nascimento"
                        value={birthDate}
                        onChangeText={(text) => {
                            setBirthDate(text);
                            if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: undefined }));
                        }}
                        error={errors.birthDate}
                        placeholder="AAAA-MM-DD (ex: 1990-12-25)"
                        required
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title={loading ? "Salvando..." : (isEditing ? "Atualizar Cliente" : "Criar Cliente")}
                            onPress={handleSave}
                            loading={loading}
                            variant="primary"
                            size="large"
                        />
                    </View>
                </ToyCard>

                {isEditing && (
                    <ToyCard colorTheme="accent" style={styles.tipCard}>
                        <Text style={styles.tipTitle}>Dica</Text>
                        <Text style={styles.tipText}>
                            Mantenha as informações sempre atualizadas para melhor atendimento!
                        </Text>
                    </ToyCard>
                )}
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
        padding: SPACING.lg,
    },
    buttonContainer: {
        marginTop: SPACING.lg,
    },
    tipCard: {
        marginTop: SPACING.lg,
    },
    tipTitle: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    tipText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default AddEditClientScreen;
