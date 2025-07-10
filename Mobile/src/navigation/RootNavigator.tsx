import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AuthContext } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <RootStack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};
