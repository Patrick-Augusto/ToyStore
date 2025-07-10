import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';

interface ToggleThemeProps {
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const ToggleTheme: React.FC<ToggleThemeProps> = ({
    showLabel = true,
    size = 'md'
}) => {
    const { mode, colors, toggleTheme } = useTheme();

    const getSize = () => {
        switch (size) {
            case 'sm': return 32;
            case 'lg': return 48;
            default: return 40;
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm': return 16;
            case 'lg': return 24;
            default: return 20;
        }
    };

    const buttonSize = getSize();
    const iconSize = getIconSize();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.primary,
                    width: buttonSize,
                    height: buttonSize,
                }
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
        >
            <Text style={[styles.icon, { fontSize: iconSize }]}>
                {mode === 'light' ? '🌙' : '☀️'}
            </Text>
            {showLabel && (
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                    {mode === 'light' ? 'Dark' : 'Light'}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        textAlign: 'center',
    },
    label: {
        fontSize: TYPOGRAPHY.fontSizes.xs,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        marginTop: 2,
        textAlign: 'center',
    },
});
