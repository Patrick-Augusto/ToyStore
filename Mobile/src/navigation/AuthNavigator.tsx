import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../types/navigation';

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
        />
    </AuthStack.Navigator>
);
