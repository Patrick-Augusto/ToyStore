import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleTheme } from './ToggleTheme';

interface ToyHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    showThemeToggle?: boolean;
}

export const ToyHeader: React.FC<ToyHeaderProps> = ({
    title,
    subtitle,
    showBackButton = false,
    onBackPress,
    showThemeToggle = true,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <View style={[styles.backgroundDecoration, { backgroundColor: colors.toyBlue }]} />
            <View style={styles.content}>
                {showBackButton && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colors.white }]}
                        onPress={onBackPress}
                    >
                        <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text.inverse }]}>{title}</Text>
                    {subtitle && <Text style={[styles.subtitle, { color: colors.text.inverse }]}>{subtitle}</Text>}
                </View>
                <View style={styles.rightContainer}>
                    {showThemeToggle && (
                        <ToggleTheme showLabel={false} size="sm" />
                    )}
                    <View style={styles.decoration}>
                        <View style={[styles.decorationCircle, { backgroundColor: colors.toyYellow }]} />
                        <View style={[styles.decorationCircle, { backgroundColor: colors.toyBlue }]} />
                        <View style={[styles.decorationCircle, { backgroundColor: colors.toyGreen }]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: SPACING.lg,
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundDecoration: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
        ...SHADOWS.sm,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.xxl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        opacity: 0.9,
    },
    rightContainer: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    decoration: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    decorationCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: SPACING.xs,
    },
});
