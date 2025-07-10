import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation';

// Main App component
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default App;
