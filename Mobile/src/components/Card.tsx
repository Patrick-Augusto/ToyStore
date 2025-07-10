import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../theme';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    style?: ViewStyle;
    padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    style,
    padding = 'md',
}) => {
    return (
        <View style={[styles.card, { padding: SPACING[padding] }, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
});
