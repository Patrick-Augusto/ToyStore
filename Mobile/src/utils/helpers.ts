import { ClientAPIResponse, Client } from '../types';

export const normalizeClientData = (apiResponse: ClientAPIResponse): Client[] => {
    return apiResponse.data.clientes.map((clientData) => ({
        id: Math.random(), // Em um caso real, você teria um ID real
        name: clientData.info.nomeCompleto,
        email: clientData.info.detalhes.email,
        birthDate: clientData.info.detalhes.nascimento,
    }));
};

export const findMissingLetter = (name: string): string => {
    const fullName = name.toLowerCase().replace(/\s+/g, '');
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (const letter of alphabet) {
        if (!fullName.includes(letter)) {
            return letter.toUpperCase();
        }
    }

    return '-';
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
