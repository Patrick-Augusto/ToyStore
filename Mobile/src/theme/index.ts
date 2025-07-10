// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
    // Toy Store Theme - Cores alegres e profissionais
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;

    // Toy Store Specific
    toyRed: string;
    toyBlue: string;
    toyGreen: string;
    toyYellow: string;
    toyPurple: string;
    toyOrange: string;

    // Neutrals
    white: string;
    black: string;
    gray: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };

    // Background
    background: string;
    surface: string;
    cardBackground: string;

    // Text
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        accent: string;
    };
}

const LIGHT_COLORS: ThemeColors = {
    // Toy Store Theme - Cores alegres e profissionais
    primary: '#FF6B6B',        // Vermelho coral - divertido mas elegante
    secondary: '#4ECDC4',      // Verde água - calmo e moderno
    accent: '#45B7D1',         // Azul céu - confiável
    success: '#96CEB4',        // Verde menta - suave
    warning: '#FFEAA7',        // Amarelo suave
    error: '#FD79A8',          // Rosa suave - menos agressivo que vermelho puro

    // Toy Store Specific
    toyRed: '#FF6B6B',
    toyBlue: '#74B9FF',
    toyGreen: '#55A3FF',
    toyYellow: '#FDCB6E',
    toyPurple: '#A29BFE',
    toyOrange: '#E17055',

    // Neutrals
    white: '#FFFFFF',
    black: '#2D3436',          // Preto mais suave
    gray: {
        50: '#F8F9FA',
        100: '#F1F3F4',
        200: '#E9ECEF',
        300: '#DEE2E6',
        400: '#ADB5BD',
        500: '#6C757D',
        600: '#495057',
        700: '#343A40',
        800: '#2D3436',
        900: '#212529',
    },

    // Background
    background: '#F8F9FA',      // Fundo mais claro e limpo
    surface: '#FFFFFF',
    cardBackground: '#FFFFFF',

    // Text
    text: {
        primary: '#2D3436',      // Preto suave para melhor legibilidade
        secondary: '#636E72',    // Cinza médio
        tertiary: '#B2BEC3',     // Cinza claro
        inverse: '#FFFFFF',
        accent: '#FF6B6B',       // Texto de destaque
    },
};

const DARK_COLORS: ThemeColors = {
    // Toy Store Theme - Cores mais suaves para dark mode
    primary: '#FF8A8A',        // Vermelho coral mais suave
    secondary: '#6EEDDD',      // Verde água mais brilhante
    accent: '#68C7F0',         // Azul céu mais claro
    success: '#B8E6D3',        // Verde menta mais claro
    warning: '#FFE8A3',        // Amarelo mais suave
    error: '#FF9BC2',          // Rosa mais suave

    // Toy Store Specific (versões dark)
    toyRed: '#FF8A8A',
    toyBlue: '#94D3FF',
    toyGreen: '#75B3FF',
    toyYellow: '#FFD68E',
    toyPurple: '#C2BBFE',
    toyOrange: '#FF9075',

    // Neutrals
    white: '#1E1E1E',          // Background escuro
    black: '#F8F9FA',          // Texto claro
    gray: {
        50: '#2D2D2D',         // Invertido para dark
        100: '#3A3A3A',
        200: '#4A4A4A',
        300: '#5A5A5A',
        400: '#6A6A6A',
        500: '#8A8A8A',
        600: '#AAAAAA',
        700: '#CACACA',
        800: '#E0E0E0',
        900: '#F0F0F0',
    },

    // Background
    background: '#121212',      // Fundo escuro
    surface: '#1E1E1E',         // Surface escura
    cardBackground: '#2D2D2D',  // Cards escuros

    // Text
    text: {
        primary: '#F8F9FA',      // Texto claro
        secondary: '#CACACA',    // Cinza claro
        tertiary: '#8A8A8A',     // Cinza médio
        inverse: '#2D3436',      // Texto escuro (para backgrounds claros)
        accent: '#FF8A8A',       // Texto de destaque
    },
};

// Função para obter as cores baseadas no tema
export const getColors = (mode: ThemeMode = 'light'): ThemeColors => {
    return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
};

// Export padrão (light mode para compatibilidade)
export const COLORS = LIGHT_COLORS;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const TYPOGRAPHY = {
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },
    fontWeights: {
        normal: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
    },
    lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },
} as const;

export const BORDER_RADIUS = {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
} as const;

export const SHADOWS = {
    sm: {
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 3,
    },
    md: {
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
    },
    lg: {
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
} as const;

// Toy Store specific design elements
export const TOY_THEME = {
    gradients: {
        primary: ['#FF6B6B', '#FF8E8E'],
        secondary: ['#4ECDC4', '#81E6D9'],
        accent: ['#45B7D1', '#68C7F0'],
        rainbow: ['#FF6B6B', '#FDCB6E', '#4ECDC4', '#74B9FF', '#A29BFE'],
    },
    animations: {
        bounce: {
            transform: [{ scale: 1.05 }],
        },
        press: {
            transform: [{ scale: 0.98 }],
        },
    },
    icons: {
        size: {
            xs: 16,
            sm: 20,
            md: 24,
            lg: 32,
            xl: 40,
        }
    }
} as const;
