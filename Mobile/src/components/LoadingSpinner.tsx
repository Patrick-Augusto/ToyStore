import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = COLORS.primary,
    text,
    fullScreen = false,
}) => {
    const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

    return (
        <View style={containerStyle}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.fontSizes.md,
        color: COLORS.text.secondary,
        textAlign: 'center',
    },
});
