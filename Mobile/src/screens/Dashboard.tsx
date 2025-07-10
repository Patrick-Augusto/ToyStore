import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { ToyHeader, ToyCard, StatCard, LoadingSpinner } from '../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAsyncState } from '../hooks';
import { formatCurrency } from '../utils/validation';

interface DashboardData {
    todaySales: number;
    weekSales: number;
    monthSales: number;
    totalClients: number;
    activeClients: number;
    topProducts: Array<{
        name: string;
        sales: number;
        percentage: number;
    }>;
    salesByDay: Array<{
        day: string;
        amount: number;
    }>;
    salesByCategory: Array<{
        category: string;
        amount: number;
        color: string;
    }>;
    recentActivity: Array<{
        id: string;
        type: 'sale' | 'client' | 'product';
        description: string;
        time: string;
        amount?: number;
    }>;
}

const Dashboard: React.FC = () => {
    const screenWidth = Dimensions.get('window').width;
    const { data, loading, execute } = useAsyncState<DashboardData>();
    const { colors } = useTheme();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        execute(async () => {
            // Simular carregamento de dados do dashboard
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                todaySales: 2450.50,
                weekSales: 12750.30,
                monthSales: 45890.75,
                totalClients: 156,
                activeClients: 89,
                topProducts: [
                    { name: 'Boneca Barbie', sales: 23, percentage: 15.2 },
                    { name: 'Carrinho Hot Wheels', sales: 18, percentage: 11.9 },
                    { name: 'Lego Classic', sales: 15, percentage: 9.9 },
                    { name: 'Pelúcia Urso', sales: 12, percentage: 7.9 },
                    { name: 'Quebra-cabeça', sales: 10, percentage: 6.6 },
                ],
                salesByDay: [
                    { day: 'Seg', amount: 1200 },
                    { day: 'Ter', amount: 1800 },
                    { day: 'Qua', amount: 2100 },
                    { day: 'Qui', amount: 1950 },
                    { day: 'Sex', amount: 2800 },
                    { day: 'Sáb', amount: 3200 },
                    { day: 'Dom', amount: 1650 },
                ],
                salesByCategory: [
                    { category: 'Bonecas', amount: 8500, color: colors.toyRed },
                    { category: 'Carrinhos', amount: 6200, color: colors.toyBlue },
                    { category: 'Educativos', amount: 4800, color: colors.toyGreen },
                    { category: 'Pelúcias', amount: 3200, color: colors.toyYellow },
                    { category: 'Eletrônicos', amount: 2100, color: colors.toyPurple },
                ],
                recentActivity: [
                    {
                        id: '1',
                        type: 'sale',
                        description: 'Venda para Maria Silva',
                        time: '2 min atrás',
                        amount: 85.50
                    },
                    {
                        id: '2',
                        type: 'client',
                        description: 'Novo cliente: João Santos',
                        time: '15 min atrás'
                    },
                    {
                        id: '3',
                        type: 'sale',
                        description: 'Venda para Ana Costa',
                        time: '1h atrás',
                        amount: 152.30
                    },
                    {
                        id: '4',
                        type: 'product',
                        description: 'Estoque baixo: Lego Batman',
                        time: '2h atrás'
                    },
                ],
            };
        });
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Carregando dashboard..." />;
    }

    if (!data) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ToyHeader title="Dashboard" subtitle="Visão geral do negócio" />
                <Text style={[styles.errorText, { color: colors.error }]}>Erro ao carregar dados</Text>
            </View>
        );
    }

    const renderSalesChart = () => {
        const chartData = {
            labels: data.salesByDay.map(item => item.day),
            datasets: [{
                data: data.salesByDay.map(item => item.amount),
                strokeWidth: 3,
            }],
        };

        return (
            <LineChart
                data={chartData}
                width={screenWidth - (SPACING.lg * 2) - 32}
                height={220}
                chartConfig={{
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text.primary,
                    style: { borderRadius: BORDER_RADIUS.md },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: colors.primary,
                        fill: colors.primary,
                    },
                }}
                bezier
                style={styles.chart}
            />
        );
    };

    const renderCategoryChart = () => {
        const chartData = data.salesByCategory.map((item, index) => ({
            name: item.category,
            population: item.amount,
            color: item.color,
            legendFontColor: colors.text.primary,
            legendFontSize: 12,
        }));

        return (
            <PieChart
                data={chartData}
                width={screenWidth - (SPACING.lg * 2) - 32}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 10]}
                absolute
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ToyHeader title="Dashboard" subtitle="Visão geral do negócio" />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Cards de resumo */}
                <View style={styles.summaryContainer}>
                    <StatCard
                        title="Vendas Hoje"
                        value={formatCurrency(data.todaySales)}
                        subtitle="Meta: R$ 3.000"
                        colorTheme="red"
                        style={styles.summaryCard}
                    />
                    <StatCard
                        title="Vendas Semana"
                        value={formatCurrency(data.weekSales)}
                        subtitle="↑ 12% vs semana anterior"
                        colorTheme="blue"
                        style={styles.summaryCard}
                    />
                    <StatCard
                        title="Vendas Mês"
                        value={formatCurrency(data.monthSales)}
                        subtitle="87% da meta mensal"
                        colorTheme="green"
                        style={styles.summaryCard}
                    />
                    <StatCard
                        title="Clientes Ativos"
                        value={`${data.activeClients}/${data.totalClients}`}
                        subtitle="57% de engajamento"
                        colorTheme="yellow"
                        style={styles.summaryCard}
                    />
                </View>

                {/* Gráfico de vendas por dia */}
                <ToyCard title="Vendas por Dia da Semana" colorTheme="primary" style={styles.chartCard}>
                    {renderSalesChart()}
                </ToyCard>

                {/* Gráfico de vendas por categoria */}
                <ToyCard title="Vendas por Categoria" colorTheme="secondary" style={styles.chartCard}>
                    {renderCategoryChart()}
                </ToyCard>

                {/* Top produtos */}
                <ToyCard title="Produtos Mais Vendidos" colorTheme="accent" style={styles.chartCard}>
                    {data.topProducts.map((product, index) => (
                        <View key={index} style={[styles.productItem, { borderBottomColor: colors.gray[200] }]}>
                            <View style={styles.productInfo}>
                                <Text style={[styles.productRank, { color: colors.primary }]}>#{index + 1}</Text>
                                <View style={styles.productDetails}>
                                    <Text style={[styles.productName, { color: colors.text.primary }]}>{product.name}</Text>
                                    <Text style={[styles.productSales, { color: colors.text.secondary }]}>{product.sales} vendas</Text>
                                </View>
                            </View>
                            <View style={styles.productPercentage}>
                                <Text style={[styles.percentageText, { color: colors.text.primary }]}>{product.percentage}%</Text>
                                <View style={[styles.progressBar, { backgroundColor: colors.gray[200] }]}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${product.percentage}%`,
                                                backgroundColor: colors.primary
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </ToyCard>

                {/* Atividade recente */}
                <ToyCard title="Atividade Recente" style={styles.chartCard}>
                    {data.recentActivity.map((activity) => (
                        <View key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.gray[200] }]}>
                            <View style={[styles.activityIcon, getActivityIconStyle(activity.type, colors)]}>
                                <Text style={styles.activityIconText}>
                                    {getActivityIcon(activity.type)}
                                </Text>
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={[styles.activityDescription, { color: colors.text.primary }]}>{activity.description}</Text>
                                <Text style={[styles.activityTime, { color: colors.text.secondary }]}>{activity.time}</Text>
                            </View>
                            {activity.amount && (
                                <Text style={[styles.activityAmount, { color: colors.success }]}>
                                    {formatCurrency(activity.amount)}
                                </Text>
                            )}
                        </View>
                    ))}
                </ToyCard>

                {/* Espaço extra no final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'sale': return '💰';
        case 'client': return '👤';
        case 'product': return '📦';
        default: return '📋';
    }
};

const getActivityIconStyle = (type: string, colors: any) => {
    switch (type) {
        case 'sale': return { backgroundColor: colors.success };
        case 'client': return { backgroundColor: colors.primary };
        case 'product': return { backgroundColor: colors.warning };
        default: return { backgroundColor: colors.gray[400] };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    summaryCard: {
        flex: 1,
        minWidth: '45%',
    },
    chartCard: {
        margin: SPACING.lg,
        marginTop: 0,
    },
    chart: {
        marginVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    productRank: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        width: 30,
    },
    productDetails: {
        marginLeft: SPACING.sm,
    },
    productName: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
    },
    productSales: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
    },
    productPercentage: {
        alignItems: 'flex-end',
        minWidth: 60,
    },
    percentageText: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        marginBottom: 2,
    },
    progressBar: {
        width: 50,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    activityIconText: {
        fontSize: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityDescription: {
        fontSize: TYPOGRAPHY.fontSizes.md,
    },
    activityTime: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        marginTop: 2,
    },
    activityAmount: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
    },
    bottomSpacing: {
        height: SPACING.xxl,
    },
    errorText: {
        textAlign: 'center',
        fontSize: TYPOGRAPHY.fontSizes.lg,
        marginTop: SPACING.xl,
    },
});

export default Dashboard;
