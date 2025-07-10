import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { clientService } from '../services/api';
import { ClientAPIResponse, Client } from '../types';
import { normalizeClientData, findMissingLetter, formatDate, formatCurrency } from '../utils/helpers';
import { ClientsStackParamList } from '../types/navigation';
import { AuthContext } from '../contexts/AuthContext';
import { ToyHeader, ToyCard, Button, InputField } from '../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAdvancedSearch, SearchFilter } from '../hooks/useAdvancedSearch';

type ClientsScreenNavigationProp = StackNavigationProp<ClientsStackParamList, 'ClientsList'>;

const ClientsScreen = () => {
    const navigation = useNavigation<ClientsScreenNavigationProp>();
    const { logout } = useContext(AuthContext);
    const { colors } = useTheme();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

    // Configuração da busca avançada
    const searchConfig = {
        searchFields: ['name', 'email'] as (keyof Client)[],
        filterableFields: ['birthDate', 'totalSpent', 'lastPurchaseDate'] as (keyof Client)[],
        sortableFields: ['name', 'email', 'birthDate', 'totalSpent', 'lastPurchaseDate'] as (keyof Client)[],
        defaultSort: { key: 'name', direction: 'asc' } as const,
    };

    const {
        searchQuery,
        filters,
        sortOption,
        results: filteredClients,
        isSearching,
        setSearchQuery,
        addFilter,
        removeFilter,
        clearFilters,
        setSortOption,
        totalResults,
        hasActiveSearch,
    } = useAdvancedSearch({
        data: clients,
        config: searchConfig,
        debounceMs: 300,
    });

    const loadClients = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response: ClientAPIResponse = await clientService.getClients({});
            const normalizedClients = normalizeClientData(response);
            setClients(normalizedClients);
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível carregar os clientes');
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleSearch = () => {
        loadClients();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        clearFilters();
        setSortOption(searchConfig.defaultSort);
        setTimeout(() => loadClients(), 100);
    };

    const handleDeleteClient = (client: Client) => {
        Alert.alert(
            'Confirmar exclusão',
            `Deseja realmente excluir o cliente ${client.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clientService.deleteClient(client.id);
                            loadClients();
                            Alert.alert('Sucesso', 'Cliente excluído com sucesso');
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o cliente');
                        }
                    },
                },
            ]
        );
    };

    const renderClient = ({ item }: { item: Client }) => {
        const missingLetter = findMissingLetter(item.name);

        return (
            <ToyCard style={styles.clientCard}>
                <View style={styles.clientHeader}>
                    <View style={styles.clientInfo}>
                        <Text style={[styles.clientName, { color: colors.text.primary }]}>{item.name}</Text>
                        <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>{item.email}</Text>
                        <Text style={[styles.clientDate, { color: colors.text.secondary }]}>
                            Nascimento: {formatDate(item.birthDate)}
                        </Text>
                    </View>
                    <View style={styles.missingLetterContainer}>
                        <Text style={[styles.missingLetterLabel, { color: colors.text.secondary }]}>Letra ausente:</Text>
                        <View style={[styles.missingLetterBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.missingLetter, { color: colors.text.inverse }]}>{missingLetter}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.clientActions}>
                    <Button
                        title="Editar"
                        onPress={() => navigation.navigate('AddEditClient', { client: item })}
                        variant="secondary"
                        size="small"
                        style={styles.editButton}
                    />
                    <Button
                        title="Excluir"
                        onPress={() => handleDeleteClient(item)}
                        variant="danger"
                        size="small"
                        style={styles.deleteButton}
                    />
                </View>
            </ToyCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ToyHeader
                title="Clientes"
                subtitle="Gerencie sua base de clientes"
            />

            <ToyCard title="Buscar Clientes" style={styles.searchCard}>
                <InputField
                    label="Busca geral (nome, email)"
                    placeholder="Digite para buscar..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <View style={styles.searchButtons}>
                    <Button
                        title={showAdvancedSearch ? "Ocultar Filtros" : "Filtros Avançados"}
                        onPress={() => setShowAdvancedSearch(!showAdvancedSearch)}
                        variant="secondary"
                        style={styles.searchButton}
                    />
                    <Button
                        title="Limpar"
                        onPress={handleClearSearch}
                        variant="secondary"
                        style={styles.clearButton}
                    />
                </View>

                {hasActiveSearch && (
                    <Text style={[styles.searchResultsText, { color: colors.text.secondary }]}>
                        {totalResults} resultado(s) encontrado(s)
                    </Text>
                )}
            </ToyCard>

            {/* Componente de filtros avançados */}
            {showAdvancedSearch && (
                <ToyCard title="Filtros Avançados" colorTheme="accent" style={styles.searchCard}>
                    <View style={styles.filterContainer}>
                        {/* Filtro por valor total gasto */}
                        <View style={styles.filterRow}>
                            <Text style={[styles.filterLabel, { color: colors.text.primary }]}>
                                Valor mínimo gasto:
                            </Text>
                            <InputField
                                placeholder="R$ 0,00"
                                keyboardType="numeric"
                                onChangeText={(value) => {
                                    const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
                                    if (!isNaN(numValue) && numValue > 0) {
                                        addFilter({
                                            key: 'totalSpent',
                                            value: numValue,
                                            operator: 'greaterThan'
                                        });
                                    } else {
                                        removeFilter('totalSpent');
                                    }
                                }}
                            />
                        </View>

                        {/* Filtro por ordenação */}
                        <View style={styles.filterRow}>
                            <Text style={[styles.filterLabel, { color: colors.text.primary }]}>
                                Ordenar por:
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.sortButtons}>
                                    {[
                                        { key: 'name', label: 'Nome' },
                                        { key: 'totalSpent', label: 'Valor Gasto' },
                                        { key: 'birthDate', label: 'Data Nasc.' },
                                    ].map((sort) => (
                                        <TouchableOpacity
                                            key={sort.key}
                                            style={[
                                                styles.sortButton,
                                                {
                                                    backgroundColor: sortOption?.key === sort.key
                                                        ? colors.primary
                                                        : colors.surface,
                                                    borderColor: colors.primary,
                                                }
                                            ]}
                                            onPress={() => {
                                                const direction = sortOption?.key === sort.key && sortOption?.direction === 'asc'
                                                    ? 'desc'
                                                    : 'asc';
                                                setSortOption({ key: sort.key, direction });
                                            }}
                                        >
                                            <Text style={[
                                                styles.sortButtonText,
                                                {
                                                    color: sortOption?.key === sort.key
                                                        ? colors.text.inverse
                                                        : colors.text.primary
                                                }
                                            ]}>
                                                {sort.label} {sortOption?.key === sort.key ? (sortOption.direction === 'asc' ? '↑' : '↓') : ''}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Limpar filtros */}
                        {hasActiveSearch && (
                            <Button
                                title="Limpar Filtros"
                                onPress={clearFilters}
                                variant="secondary"
                                size="small"
                            />
                        )}
                    </View>
                </ToyCard>
            )}

            <FlatList
                data={filteredClients.length > 0 ? filteredClients : clients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderClient}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadClients(true)}
                        colors={[colors.primary, colors.secondary]}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <ToyCard colorTheme="accent" style={styles.emptyCard}>
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.text.primary }]}>
                                {loading ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                            </Text>
                            {!loading && (
                                <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                                    Que tal adicionar o primeiro cliente?
                                </Text>
                            )}
                        </View>
                    </ToyCard>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('AddEditClient', { client: undefined })}
                activeOpacity={0.8}
            >
                <Text style={[styles.fabText, { color: colors.text.inverse }]}>+</Text>
                <Text style={[styles.fabLabel, { color: colors.text.inverse }]}>Novo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchCard: {
        margin: SPACING.lg,
        marginBottom: SPACING.md,
    },
    searchButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
    },
    searchButton: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    clearButton: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    searchResultsText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontStyle: 'italic',
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    filterContainer: {
        gap: SPACING.md,
    },
    filterRow: {
        gap: SPACING.sm,
    },
    filterLabel: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    sortButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.xs,
    },
    sortButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        minWidth: 80,
        alignItems: 'center',
    },
    sortButtonText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    listContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 100, // Space for FAB
    },
    clientCard: {
        marginBottom: SPACING.md,
    },
    clientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    clientInfo: {
        flex: 1,
        marginRight: SPACING.md,
    },
    clientName: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        marginBottom: SPACING.xs,
    },
    clientEmail: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        marginBottom: SPACING.xs,
    },
    clientDate: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
    },
    missingLetterContainer: {
        alignItems: 'center',
    },
    missingLetterLabel: {
        fontSize: TYPOGRAPHY.fontSizes.xs,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    missingLetterBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    missingLetter: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    clientActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    deleteButton: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    emptyCard: {
        margin: SPACING.lg,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emptyText: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    emptySubtext: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.lg,
        right: SPACING.lg,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.lg,
    },
    fabText: {
        fontSize: 24,
        marginBottom: 2,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    fabLabel: {
        fontSize: TYPOGRAPHY.fontSizes.xs,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
});

export default ClientsScreen;
