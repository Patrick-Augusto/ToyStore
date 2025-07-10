import { VALIDATION_RULES } from '../config/constants';

export const validateEmail = (email: string): boolean => {
    return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH;
};

export const validateName = (name: string): boolean => {
    return name.trim().length > 0 && name.length <= VALIDATION_RULES.MAX_NAME_LENGTH;
};

export const validateBirthDate = (birthDate: string): boolean => {
    const date = new Date(birthDate);
    const now = new Date();
    const minAge = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

    return date <= now && date >= minAge;
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

export const formatChartDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
