import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon?: string;
    colorTheme?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
    style?: any;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon = '🎯',
    colorTheme = 'red',
    style,
}) => {
    const getThemeColor = () => {
        switch (colorTheme) {
            case 'blue': return COLORS.toyBlue;
            case 'green': return COLORS.toyGreen;
            case 'yellow': return COLORS.toyYellow;
            case 'purple': return COLORS.toyPurple;
            default: return COLORS.toyRed;
        }
    };

    const themeColor = getThemeColor();

    return (
        <View style={[styles.container, { borderLeftColor: themeColor }, style]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: themeColor }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={[styles.value, { color: themeColor }]}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderLeftWidth: 4,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    icon: {
        fontSize: 16,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        color: COLORS.text.secondary,
        flex: 1,
    },
    value: {
        fontSize: TYPOGRAPHY.fontSizes.xl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.tertiary,
    },
});
