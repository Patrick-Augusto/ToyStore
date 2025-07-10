import React, { useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { statsService } from '../services/api';
import { SalesByDay, ClientStats } from '../types';
import { useAsyncState } from '../hooks';
import { LoadingSpinner, ToyCard, ToyHeader } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../theme';
import { formatCurrency, formatChartDate } from '../utils/validation';
import { APP_CONFIG } from '../config/constants';

interface StatsData {
    salesByDay: SalesByDay[];
    clientStats: ClientStats | null;
}

const StatsScreen: React.FC = () => {
    const { data, loading, execute } = useAsyncState<StatsData>({
        initialData: { salesByDay: [], clientStats: null }
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = () => {
        execute(async () => {
            const [salesData, clientStatsData] = await Promise.all([
                statsService.getSalesByDay(),
                statsService.getClientStats(),
            ]);

            return {
                salesByDay: salesData || [],
                clientStats: clientStatsData || null,
            };
        });
    };

    const screenWidth = Dimensions.get('window').width;

    const formatChartData = () => {
        if (!data?.salesByDay?.length) return null;

        const sortedData = data.salesByDay
            .sort((a: SalesByDay, b: SalesByDay) =>
                new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
            )
            .slice(-APP_CONFIG.CHART_DAYS_LIMIT);

        return {
            labels: sortedData.map((item: SalesByDay) => formatChartDate(item.sale_date)),
            datasets: [{
                data: sortedData.map((item: SalesByDay) => item.total_sales),
                strokeWidth: 2,
            }],
        };
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Carregando estatísticas..." />;
    }

    const chartData = formatChartData();

    return (
        <View style={styles.container}>
            <ToyHeader
                title="Estatísticas"
                subtitle="Acompanhe o desempenho da loja"
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ToyCard title="Vendas por Dia (Últimos 7 dias)" style={styles.chartCard}>
                    {chartData ? (
                        <LineChart
                            data={chartData}
                            width={screenWidth - (SPACING.lg * 2)}
                            height={220}
                            chartConfig={{
                                backgroundColor: COLORS.white,
                                backgroundGradientFrom: COLORS.white,
                                backgroundGradientTo: COLORS.white,
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: BORDER_RADIUS.md,
                                },
                                propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: COLORS.primary,
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <Text style={styles.noDataText}>Nenhum dado disponível</Text>
                    )}
                </ToyCard>

                {data?.clientStats && (
                    <ToyCard title="Estatísticas de Clientes" style={styles.statsCard}>
                        <View style={styles.statItem}>
                            <Text style={styles.statTitle}>Maior Volume Total</Text>
                            <Text style={styles.statClient}>
                                {data.clientStats.topVolumeClient?.name || 'N/A'}
                            </Text>
                            <Text style={styles.statValue}>
                                {formatCurrency(data.clientStats.topVolumeClient?.total_volume || 0)}
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statTitle}>Maior Ticket Médio</Text>
                            <Text style={styles.statClient}>
                                {data.clientStats.topAverageClient?.name || 'N/A'}
                            </Text>
                            <Text style={styles.statValue}>
                                {formatCurrency(data.clientStats.topAverageClient?.average_value || 0)}
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statTitle}>Cliente Mais Frequente</Text>
                            <Text style={styles.statClient}>
                                {data.clientStats.topFrequencyClient?.name || 'N/A'}
                            </Text>
                            <Text style={styles.statValue}>
                                {data.clientStats.topFrequencyClient?.unique_days || 0} dias únicos
                            </Text>
                        </View>
                    </ToyCard>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        paddingBottom: SPACING.lg,
    },
    chartCard: {
        margin: SPACING.lg,
    },
    statsCard: {
        margin: SPACING.lg,
        marginTop: 0,
    },
    chart: {
        marginVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    noDataText: {
        textAlign: 'center',
        color: COLORS.text.secondary,
        fontSize: TYPOGRAPHY.fontSizes.md,
        padding: SPACING.lg,
    },
    statItem: {
        backgroundColor: COLORS.gray[50],
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    statTitle: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xs,
    },
    statClient: {
        fontSize: TYPOGRAPHY.fontSizes.md,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    statValue: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.primary,
    },
});

export default StatsScreen;
