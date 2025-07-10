import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';

interface InputFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    error,
    required = false,
    style,
    ...textInputProps
}) => {
    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={COLORS.text.tertiary}
                {...textInputProps}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    required: {
        color: COLORS.error,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: TYPOGRAPHY.fontSizes.md,
        backgroundColor: COLORS.white,
        color: COLORS.text.primary,
        minHeight: 44,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
});
