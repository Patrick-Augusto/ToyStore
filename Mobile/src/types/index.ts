export interface Client {
    id: number;
    name: string;
    email: string;
    birthDate: string;
}

export interface Sale {
    id: number;
    clientId: number;
    value: number;
    date: string;
}

export interface ClientStats {
    topVolumeClient: {
        id: number;
        name: string;
        email: string;
        total_volume: number;
    };
    topAverageClient: {
        id: number;
        name: string;
        email: string;
        average_value: number;
        total_sales: number;
    };
    topFrequencyClient: {
        id: number;
        name: string;
        email: string;
        total_sales: number;
        unique_days: number;
    };
}

export interface SalesByDay {
    sale_date: string;
    total_sales: number;
    total_transactions: number;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithToken: (token: string) => void;
    logout: () => void;
}

// Tipos para a API estruturada conforme especificado
export interface ClientAPIResponse {
    data: {
        clientes: Array<{
            info: {
                nomeCompleto: string;
                detalhes: {
                    email: string;
                    nascimento: string;
                };
            };
            duplicado?: {
                nomeCompleto: string;
            };
            estatisticas: {
                vendas: Array<{
                    data: string;
                    valor: number;
                }>;
            };
        }>;
    };
    meta: {
        registroTotal: number;
        pagina: number;
    };
    redundante: {
        status: string;
    };
}
