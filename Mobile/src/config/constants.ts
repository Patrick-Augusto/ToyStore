export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_DATA: 'userData',
    THEME: 'theme',
} as const;

export const VALIDATION_RULES = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 100,
} as const;

export const APP_CONFIG = {
    CHART_DAYS_LIMIT: 7,
    CLIENT_LIST_PAGE_SIZE: 20,
    DEFAULT_TIMEOUT: 5000,
} as const;
