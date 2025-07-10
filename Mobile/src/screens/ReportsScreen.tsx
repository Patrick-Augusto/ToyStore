import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { ToyHeader, ToyCard, LoadingSpinner, Button } from '../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAsyncState } from '../hooks';
import { formatCurrency } from '../utils/validation';

type ReportType = 'sales' | 'clients' | 'products' | 'financial';
type Period = 'week' | 'month' | 'quarter' | 'year';

interface ReportData {
    salesReport: {
        totalSales: number;
        averageTicket: number;
        transactionCount: number;
        topSellingDays: Array<{
            day: string;
            amount: number;
            count: number;
        }>;
        salesTrend: Array<{
            period: string;
            amount: number;
        }>;
    };
    clientsReport: {
        totalClients: number;
        activeClients: number;
        newClients: number;
        clientsByAge: Array<{
            ageRange: string;
            count: number;
        }>;
        clientsGrowth: Array<{
            period: string;
            count: number;
        }>;
    };
    productsReport: {
        totalProducts: number;
        topProducts: Array<{
            name: string;
            sold: number;
            revenue: number;
        }>;
        categoryPerformance: Array<{
            category: string;
            sold: number;
            revenue: number;
        }>;
    };
    financialReport: {
        totalRevenue: number;
        totalCosts: number;
        profit: number;
        monthlyRevenue: Array<{
            month: string;
            revenue: number;
            costs: number;
        }>;
    };
}

const ReportsScreen: React.FC = () => {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
    const [selectedPeriod, setPeriod] = useState<Period>('month');
    const { data, loading, execute } = useAsyncState<ReportData>();

    useEffect(() => {
        loadReportData();
    }, [selectedReport, selectedPeriod]);

    const loadReportData = () => {
        execute(async () => {
            // Simular carregamento de dados
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                salesReport: {
                    totalSales: 45890.75,
                    averageTicket: 127.34,
                    transactionCount: 360,
                    topSellingDays: [
                        { day: 'Sábado', amount: 3200, count: 28 },
                        { day: 'Sexta', amount: 2800, count: 24 },
                        { day: 'Domingo', amount: 2100, count: 19 },
                    ],
                    salesTrend: [
                        { period: 'Jan', amount: 38000 },
                        { period: 'Fev', amount: 42000 },
                        { period: 'Mar', amount: 45890 },
                        { period: 'Abr', amount: 48200 },
                        { period: 'Mai', amount: 44500 },
                        { period: 'Jun', amount: 47800 },
                    ],
                },
                clientsReport: {
                    totalClients: 156,
                    activeClients: 89,
                    newClients: 23,
                    clientsByAge: [
                        { ageRange: '18-25', count: 45 },
                        { ageRange: '26-35', count: 62 },
                        { ageRange: '36-45', count: 38 },
                        { ageRange: '46+', count: 11 },
                    ],
                    clientsGrowth: [
                        { period: 'Jan', count: 120 },
                        { period: 'Fev', count: 135 },
                        { period: 'Mar', count: 148 },
                        { period: 'Abr', count: 156 },
                    ],
                },
                productsReport: {
                    totalProducts: 245,
                    topProducts: [
                        { name: 'Boneca Barbie', sold: 23, revenue: 1150 },
                        { name: 'Carrinho Hot Wheels', sold: 18, revenue: 720 },
                        { name: 'Lego Classic', sold: 15, revenue: 1200 },
                    ],
                    categoryPerformance: [
                        { category: 'Bonecas', sold: 45, revenue: 2250 },
                        { category: 'Carrinhos', sold: 38, revenue: 1520 },
                        { category: 'Educativos', sold: 32, revenue: 1600 },
                    ],
                },
                financialReport: {
                    totalRevenue: 45890.75,
                    totalCosts: 28450.23,
                    profit: 17440.52,
                    monthlyRevenue: [
                        { month: 'Jan', revenue: 38000, costs: 23000 },
                        { month: 'Fev', revenue: 42000, costs: 25200 },
                        { month: 'Mar', revenue: 45890, costs: 28450 },
                    ],
                },
            };
        });
    };

    const reportTypes = [
        { key: 'sales', label: 'Vendas', icon: '💰' },
        { key: 'clients', label: 'Clientes', icon: '👥' },
        { key: 'products', label: 'Produtos', icon: '🎁' },
        { key: 'financial', label: 'Financeiro', icon: '📊' },
    ];

    const periods = [
        { key: 'week', label: 'Semana' },
        { key: 'month', label: 'Mês' },
        { key: 'quarter', label: 'Trimestre' },
        { key: 'year', label: 'Ano' },
    ];

    const renderSalesReport = () => {
        if (!data?.salesReport) return null;

        const chartData = {
            labels: data.salesReport.salesTrend.map(item => item.period),
            datasets: [{
                data: data.salesReport.salesTrend.map(item => item.amount),
            }],
        };

        return (
            <View>
                <ToyCard title="Resumo de Vendas" colorTheme="primary">
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Total de Vendas
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.success }]}>
                                {formatCurrency(data.salesReport.totalSales)}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Ticket Médio
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.primary }]}>
                                {formatCurrency(data.salesReport.averageTicket)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Transações
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.accent }]}>
                                {data.salesReport.transactionCount}
                            </Text>
                        </View>
                    </View>
                </ToyCard>

                <ToyCard title="Tendência de Vendas" colorTheme="secondary">
                    <LineChart
                        data={chartData}
                        width={screenWidth - (SPACING.lg * 2) - 32}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => colors.primary,
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
                </ToyCard>

                <ToyCard title="Melhores Dias de Venda" colorTheme="success">
                    {data.salesReport.topSellingDays.map((day, index) => (
                        <View key={index} style={[styles.listItem, { borderBottomColor: colors.gray[200] }]}>
                            <View style={styles.listItemContent}>
                                <Text style={[styles.listItemTitle, { color: colors.text.primary }]}>
                                    {day.day}
                                </Text>
                                <Text style={[styles.listItemSubtitle, { color: colors.text.secondary }]}>
                                    {day.count} transações
                                </Text>
                            </View>
                            <Text style={[styles.listItemValue, { color: colors.success }]}>
                                {formatCurrency(day.amount)}
                            </Text>
                        </View>
                    ))}
                </ToyCard>
            </View>
        );
    };

    const renderClientsReport = () => {
        if (!data?.clientsReport) return null;

        const pieData = data.clientsReport.clientsByAge.map((item, index) => ({
            name: item.ageRange,
            population: item.count,
            color: [colors.toyRed, colors.toyBlue, colors.toyGreen, colors.toyYellow][index],
            legendFontColor: colors.text.primary,
            legendFontSize: 12,
        }));

        return (
            <View>
                <ToyCard title="Resumo de Clientes" colorTheme="secondary">
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Total de Clientes
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.primary }]}>
                                {data.clientsReport.totalClients}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Clientes Ativos
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.success }]}>
                                {data.clientsReport.activeClients}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Novos Clientes
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.accent }]}>
                                {data.clientsReport.newClients}
                            </Text>
                        </View>
                    </View>
                </ToyCard>

                <ToyCard title="Clientes por Faixa Etária" colorTheme="accent">
                    <PieChart
                        data={pieData}
                        width={screenWidth - (SPACING.lg * 2) - 32}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => colors.text.primary,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        center={[10, 10]}
                        absolute
                    />
                </ToyCard>
            </View>
        );
    };

    const renderProductsReport = () => {
        if (!data?.productsReport) return null;

        return (
            <View>
                <ToyCard title="Produtos Mais Vendidos" colorTheme="accent">
                    {data.productsReport.topProducts.map((product, index) => (
                        <View key={index} style={[styles.listItem, { borderBottomColor: colors.gray[200] }]}>
                            <View style={styles.listItemContent}>
                                <Text style={[styles.listItemTitle, { color: colors.text.primary }]}>
                                    {product.name}
                                </Text>
                                <Text style={[styles.listItemSubtitle, { color: colors.text.secondary }]}>
                                    {product.sold} vendidos
                                </Text>
                            </View>
                            <Text style={[styles.listItemValue, { color: colors.success }]}>
                                {formatCurrency(product.revenue)}
                            </Text>
                        </View>
                    ))}
                </ToyCard>

                <ToyCard title="Performance por Categoria" colorTheme="success">
                    {data.productsReport.categoryPerformance.map((category, index) => (
                        <View key={index} style={[styles.listItem, { borderBottomColor: colors.gray[200] }]}>
                            <View style={styles.listItemContent}>
                                <Text style={[styles.listItemTitle, { color: colors.text.primary }]}>
                                    {category.category}
                                </Text>
                                <Text style={[styles.listItemSubtitle, { color: colors.text.secondary }]}>
                                    {category.sold} vendidos
                                </Text>
                            </View>
                            <Text style={[styles.listItemValue, { color: colors.success }]}>
                                {formatCurrency(category.revenue)}
                            </Text>
                        </View>
                    ))}
                </ToyCard>
            </View>
        );
    };

    const renderFinancialReport = () => {
        if (!data?.financialReport) return null;

        const chartData = {
            labels: data.financialReport.monthlyRevenue.map(item => item.month),
            datasets: [
                {
                    data: data.financialReport.monthlyRevenue.map(item => item.revenue),
                    color: (opacity = 1) => colors.success,
                },
                {
                    data: data.financialReport.monthlyRevenue.map(item => item.costs),
                    color: (opacity = 1) => colors.error,
                },
            ],
        };

        return (
            <View>
                <ToyCard title="Resumo Financeiro" colorTheme="success">
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Receita Total
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.success }]}>
                                {formatCurrency(data.financialReport.totalRevenue)}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Custos Totais
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.error }]}>
                                {formatCurrency(data.financialReport.totalCosts)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                                Lucro Líquido
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.primary }]}>
                                {formatCurrency(data.financialReport.profit)}
                            </Text>
                        </View>
                    </View>
                </ToyCard>

                <ToyCard title="Receita vs Custos" colorTheme="accent">
                    <LineChart
                        data={chartData}
                        width={screenWidth - (SPACING.lg * 2) - 32}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => colors.primary,
                            labelColor: (opacity = 1) => colors.text.primary,
                            style: { borderRadius: BORDER_RADIUS.md },
                        }}
                        bezier
                        style={styles.chart}
                    />
                </ToyCard>
            </View>
        );
    };

    const renderReportContent = () => {
        switch (selectedReport) {
            case 'sales':
                return renderSalesReport();
            case 'clients':
                return renderClientsReport();
            case 'products':
                return renderProductsReport();
            case 'financial':
                return renderFinancialReport();
            default:
                return null;
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Carregando relatórios..." />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ToyHeader title="Relatórios" subtitle="Análise detalhada do negócio" />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Seletor de tipo de relatório */}
                <ToyCard title="Tipo de Relatório" style={styles.selectorCard}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.reportTypeContainer}>
                            {reportTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.key}
                                    style={[
                                        styles.reportTypeButton,
                                        {
                                            backgroundColor: selectedReport === type.key
                                                ? colors.primary
                                                : colors.surface,
                                            borderColor: colors.primary,
                                        }
                                    ]}
                                    onPress={() => setSelectedReport(type.key as ReportType)}
                                >
                                    <Text style={styles.reportTypeIcon}>{type.icon}</Text>
                                    <Text style={[
                                        styles.reportTypeLabel,
                                        {
                                            color: selectedReport === type.key
                                                ? colors.text.inverse
                                                : colors.text.primary
                                        }
                                    ]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </ToyCard>

                {/* Seletor de período */}
                <ToyCard title="Período" style={styles.selectorCard}>
                    <View style={styles.periodContainer}>
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                style={[
                                    styles.periodButton,
                                    {
                                        backgroundColor: selectedPeriod === period.key
                                            ? colors.accent
                                            : colors.surface,
                                        borderColor: colors.accent,
                                    }
                                ]}
                                onPress={() => setPeriod(period.key as Period)}
                            >
                                <Text style={[
                                    styles.periodLabel,
                                    {
                                        color: selectedPeriod === period.key
                                            ? colors.text.inverse
                                            : colors.text.primary
                                    }
                                ]}>
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ToyCard>

                {/* Conteúdo do relatório */}
                {renderReportContent()}

                {/* Espaço extra no final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    selectorCard: {
        margin: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    reportTypeContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    reportTypeButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        borderWidth: 2,
        minWidth: 80,
    },
    reportTypeIcon: {
        fontSize: 24,
        marginBottom: SPACING.xs,
    },
    reportTypeLabel: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    periodContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        flexWrap: 'wrap',
    },
    periodButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        flex: 1,
        alignItems: 'center',
    },
    periodLabel: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    summaryValue: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    chart: {
        marginVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
    },
    listItemSubtitle: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        marginTop: 2,
    },
    listItemValue: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    bottomSpacing: {
        height: SPACING.xxl,
    },
});

export default ReportsScreen;
