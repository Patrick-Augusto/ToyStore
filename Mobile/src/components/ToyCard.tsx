import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../theme';

interface ToyCardProps {
    children: React.ReactNode;
    title?: string;
    colorTheme?: 'primary' | 'secondary' | 'accent' | 'success';
    onPress?: () => void;
    style?: any;
}

export const ToyCard: React.FC<ToyCardProps> = ({
    children,
    title,
    colorTheme = 'primary',
    onPress,
    style,
}) => {
    const getThemeColors = () => {
        switch (colorTheme) {
            case 'secondary':
                return { main: COLORS.secondary, light: COLORS.toyBlue };
            case 'accent':
                return { main: COLORS.accent, light: COLORS.toyGreen };
            case 'success':
                return { main: COLORS.success, light: COLORS.toyYellow };
            default:
                return { main: COLORS.primary, light: COLORS.toyRed };
        }
    };

    const colors = getThemeColors();
    const CardComponent = onPress ? TouchableOpacity : View;

    return (
        <CardComponent
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            <View style={[styles.headerBar, { backgroundColor: colors.main }]} />
            <View style={styles.content}>
                {title && (
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={[styles.titleDot, { backgroundColor: colors.light }]} />
                    </View>
                )}
                {children}
            </View>
            <View style={[styles.cornerDecoration, { backgroundColor: colors.light }]} />
        </CardComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        ...SHADOWS.md,
    },
    headerBar: {
        height: 4,
        width: '100%',
    },
    content: {
        padding: SPACING.lg,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.primary,
        flex: 1,
    },
    titleDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    cornerDecoration: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 30,
        height: 30,
        borderRadius: 15,
        opacity: 0.3,
    },
});
