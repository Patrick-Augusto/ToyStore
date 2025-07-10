import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    const getButtonStyle = (): ViewStyle => {
        const baseStyles: ViewStyle[] = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];

        if (isDisabled) {
            baseStyles.push(styles.disabledButton);
        }

        if (style) {
            baseStyles.push(style);
        }

        return StyleSheet.flatten(baseStyles);
    };

    const getTextStyle = (): TextStyle => {
        const baseStyles: TextStyle[] = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];

        if (isDisabled) {
            baseStyles.push(styles.disabledText);
        }

        if (textStyle) {
            baseStyles.push(textStyle);
        }

        return StyleSheet.flatten(baseStyles);
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    // Variants
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: COLORS.gray[500],
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderColor: COLORS.primary,
    },
    dangerButton: {
        backgroundColor: COLORS.error,
    },

    // Sizes
    smallButton: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        minHeight: 32,
    },
    mediumButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        minHeight: 44,
    },
    largeButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        minHeight: 56,
    },

    // Disabled
    disabledButton: {
        opacity: 0.6,
    },

    // Text styles
    text: {
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        textAlign: 'center',
    },

    // Text variants
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    dangerText: {
        color: COLORS.white,
    },

    // Text sizes
    smallText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
    },
    mediumText: {
        fontSize: TYPOGRAPHY.fontSizes.md,
    },
    largeText: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
    },

    disabledText: {
        opacity: 0.7,
    },
});
