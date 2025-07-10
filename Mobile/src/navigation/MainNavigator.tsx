import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ClientsNavigator } from './ClientsNavigator';
import StatsScreen from '../screens/StatsScreen';
import Dashboard from '../screens/Dashboard';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { Platform, View, Text } from 'react-native';

const MainTab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
    const { colors } = useTheme();

    // Labels customizadas para cada aba
    const tabLabels: Record<keyof MainTabParamList, string> = {
        Dashboard: 'Dashboard',
        Clients: 'Clientes',
        Reports: 'Relatórios',
        Stats: 'Estatísticas',
        Settings: 'Configurações',
    };

    return (
        <MainTab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Clients') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Reports') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Stats') {
                        iconName = focused ? 'analytics' : 'analytics-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'ellipse';
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -10 }}>
                            <Ionicons name={iconName} size={size} color={color} />
                            <Text style={{ color, fontSize: 10, marginTop: 2 }}>
                                {tabLabels[route.name]}
                            </Text>
                        </View>
                    );
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.secondary,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'android' ? 0 : 0,
                    left: 16,
                    right: 16,
                    elevation: 5,
                    backgroundColor: colors.gray[200],  // cor suave
                    borderRadius: 20,
                    height: 80,   // maior para estender para cima
                    paddingTop: 16,
                    paddingBottom: 16,
                    marginTop: 10,  // estende barra para cima
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                tabBarItemStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 4,
                },
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTintColor: colors.text.primary,
            })}
        >
            <MainTab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ title: 'Dashboard' }}
            />
            <MainTab.Screen
                name="Clients"
                component={ClientsNavigator}
                options={{ headerShown: false }}
            />
            <MainTab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{ title: 'Relatórios' }}
            />
            <MainTab.Screen
                name="Stats"
                component={StatsScreen}
                options={{ title: 'Estatísticas' }}
            />
            <MainTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Configurações' }}
            />
        </MainTab.Navigator>
    );
};
