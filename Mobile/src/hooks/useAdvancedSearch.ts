import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAsyncState } from './useAsyncState';

export interface SearchFilter {
    key: string;
    value: any;
    operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

export interface SortOption {
    key: string;
    direction: 'asc' | 'desc';
}

export interface SearchConfig<T> {
    searchFields: (keyof T)[];
    filterableFields: (keyof T)[];
    sortableFields: (keyof T)[];
    defaultSort?: SortOption;
}

export interface UseAdvancedSearchProps<T> {
    data: T[];
    config: SearchConfig<T>;
    debounceMs?: number;
}

export interface UseAdvancedSearchReturn<T> {
    // Estados
    searchQuery: string;
    filters: SearchFilter[];
    sortOption: SortOption | null;
    results: T[];
    isSearching: boolean;

    // Ações
    setSearchQuery: (query: string) => void;
    addFilter: (filter: SearchFilter) => void;
    removeFilter: (key: string) => void;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    setSortOption: (sort: SortOption | null) => void;
    reset: () => void;

    // Estatísticas
    totalResults: number;
    hasActiveSearch: boolean;
}

export const useAdvancedSearch = <T extends Record<string, any>>({
    data,
    config,
    debounceMs = 300,
}: UseAdvancedSearchProps<T>): UseAdvancedSearchReturn<T> => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilter[]>([]);
    const [sortOption, setSortOption] = useState<SortOption | null>(config.defaultSort || null);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const { data: results, loading: isSearching, execute } = useAsyncState<T[]>({
        initialData: data,
    });

    // Debounce para a busca por texto
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchQuery, debounceMs]);

    // Função para aplicar filtros de texto
    const applyTextSearch = useCallback((items: T[], query: string): T[] => {
        if (!query.trim()) return items;

        const lowercaseQuery = query.toLowerCase();

        return items.filter(item => {
            return config.searchFields.some(field => {
                const fieldValue = item[field];
                if (fieldValue == null) return false;

                return String(fieldValue).toLowerCase().includes(lowercaseQuery);
            });
        });
    }, [config.searchFields]);

    // Função para aplicar filtros customizados
    const applyFilters = useCallback((items: T[], filterList: SearchFilter[]): T[] => {
        return filterList.reduce((filteredItems, filter) => {
            return filteredItems.filter(item => {
                const fieldValue = item[filter.key];
                const filterValue = filter.value;

                if (fieldValue == null) return false;

                switch (filter.operator || 'equals') {
                    case 'equals':
                        return fieldValue === filterValue;
                    case 'contains':
                        return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'startsWith':
                        return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
                    case 'endsWith':
                        return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
                    case 'greaterThan':
                        return Number(fieldValue) > Number(filterValue);
                    case 'lessThan':
                        return Number(fieldValue) < Number(filterValue);
                    default:
                        return fieldValue === filterValue;
                }
            });
        }, items);
    }, []);

    // Função para aplicar ordenação
    const applySorting = useCallback((items: T[], sort: SortOption | null): T[] => {
        if (!sort) return items;

        return [...items].sort((a, b) => {
            const aValue = a[sort.key];
            const bValue = b[sort.key];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            let comparison = 0;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else if (aValue instanceof Date && bValue instanceof Date) {
                comparison = aValue.getTime() - bValue.getTime();
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sort.direction === 'desc' ? -comparison : comparison;
        });
    }, []);

    // Executar busca quando dados, query ou filtros mudarem
    useEffect(() => {
        execute(async () => {
            // Simular delay assíncrono para demonstrar loading
            await new Promise(resolve => setTimeout(resolve, 100));

            let filteredData = [...data];

            // Aplicar busca por texto
            filteredData = applyTextSearch(filteredData, debouncedSearchQuery);

            // Aplicar filtros customizados
            filteredData = applyFilters(filteredData, filters);

            // Aplicar ordenação
            filteredData = applySorting(filteredData, sortOption);

            return filteredData;
        });
    }, [data, debouncedSearchQuery, filters, sortOption, execute, applyTextSearch, applyFilters, applySorting]);

    // Funções para gerenciar filtros
    const addFilter = useCallback((filter: SearchFilter) => {
        setFilters(prev => {
            const existingIndex = prev.findIndex(f => f.key === filter.key);
            if (existingIndex >= 0) {
                // Atualizar filtro existente
                const newFilters = [...prev];
                newFilters[existingIndex] = filter;
                return newFilters;
            } else {
                // Adicionar novo filtro
                return [...prev, filter];
            }
        });
    }, []);

    const removeFilter = useCallback((key: string) => {
        setFilters(prev => prev.filter(f => f.key !== key));
    }, []);

    const updateFilter = useCallback((key: string, value: any) => {
        setFilters(prev => prev.map(f =>
            f.key === key ? { ...f, value } : f
        ));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters([]);
    }, []);

    const reset = useCallback(() => {
        setSearchQuery('');
        setFilters([]);
        setSortOption(config.defaultSort || null);
    }, [config.defaultSort]);

    // Estatísticas calculadas
    const totalResults = results?.length || 0;
    const hasActiveSearch = useMemo(() => {
        return debouncedSearchQuery.trim() !== '' || filters.length > 0;
    }, [debouncedSearchQuery, filters]);

    return {
        // Estados
        searchQuery,
        filters,
        sortOption,
        results: results || [],
        isSearching,

        // Ações
        setSearchQuery,
        addFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        setSortOption,
        reset,

        // Estatísticas
        totalResults,
        hasActiveSearch,
    };
};
