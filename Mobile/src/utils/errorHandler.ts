export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTHENTICATION = 'AUTHENTICATION',
    VALIDATION = 'VALIDATION',
    NOT_FOUND = 'NOT_FOUND',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: any;
    code?: string | number;
}

export class CustomError extends Error {
    public type: ErrorType;
    public code?: string | number;
    public originalError?: any;

    constructor(type: ErrorType, message: string, code?: string | number, originalError?: any) {
        super(message);
        this.name = 'CustomError';
        this.type = type;
        this.code = code;
        this.originalError = originalError;
    }
}

export const createError = (
    type: ErrorType,
    message: string,
    code?: string | number,
    originalError?: any
): CustomError => {
    return new CustomError(type, message, code, originalError);
};

export const handleApiError = (error: any): CustomError => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        switch (status) {
            case 401:
                return createError(ErrorType.AUTHENTICATION, 'Credenciais inválidas', status, error);
            case 404:
                return createError(ErrorType.NOT_FOUND, 'Recurso não encontrado', status, error);
            case 422:
                return createError(ErrorType.VALIDATION, message, status, error);
            case 500:
                return createError(ErrorType.SERVER, 'Erro interno do servidor', status, error);
            default:
                return createError(ErrorType.SERVER, message, status, error);
        }
    } else if (error.request) {
        return createError(ErrorType.NETWORK, 'Erro de conexão com o servidor', undefined, error);
    } else {
        return createError(ErrorType.UNKNOWN, error.message || 'Erro desconhecido', undefined, error);
    }
};

export const getErrorMessage = (error: any): string => {
    if (error instanceof CustomError) {
        return error.message;
    }

    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return 'Erro desconhecido';
};
