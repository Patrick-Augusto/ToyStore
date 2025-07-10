import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientsScreen from '../screens/ClientsScreen';
import AddEditClientScreen from '../screens/AddEditClientScreen';
import { ClientsStackParamList } from '../types/navigation';

const ClientsStack = createStackNavigator<ClientsStackParamList>();

export const ClientsNavigator: React.FC = () => (
    <ClientsStack.Navigator>
        <ClientsStack.Screen
            name="ClientsList"
            component={ClientsScreen}
            options={{ title: 'Clientes' }}
        />
        <ClientsStack.Screen
            name="AddEditClient"
            component={AddEditClientScreen}
            options={({ route }) => ({
                title: route.params?.client ? 'Editar Cliente' : 'Novo Cliente'
            })}
        />
    </ClientsStack.Navigator>
);
