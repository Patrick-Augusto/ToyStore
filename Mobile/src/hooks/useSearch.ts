import { useState, useCallback } from 'react';
import { debounce } from '../utils/validation';

interface UseSearchOptions {
    debounceMs?: number;
    minSearchLength?: number;
}

interface UseSearchReturn<T> {
    searchQuery: string;
    searchResults: T[];
    isSearching: boolean;
    setSearchQuery: (query: string) => void;
    performSearch: (searchFunction: (query: string) => Promise<T[]>) => void;
    clearSearch: () => void;
}

export const useSearch = <T = any>(
    options: UseSearchOptions = {}
): UseSearchReturn<T> => {
    const { debounceMs = 300, minSearchLength = 2 } = options;

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<T[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const debouncedSearch = useCallback(
        debounce(async (query: string, searchFunction: (query: string) => Promise<T[]>) => {
            if (query.length < minSearchLength) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            try {
                setIsSearching(true);
                const results = await searchFunction(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, debounceMs),
        [debounceMs, minSearchLength]
    );

    const performSearch = useCallback(
        (searchFunction: (query: string) => Promise<T[]>) => {
            debouncedSearch(searchQuery, searchFunction);
        },
        [searchQuery, debouncedSearch]
    );

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    }, []);

    return {
        searchQuery,
        searchResults,
        isSearching,
        setSearchQuery,
        performSearch,
        clearSearch,
    };
};
