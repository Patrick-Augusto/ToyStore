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
import { LoadingSpinner, ToyCard, StatCard, ToyHeader } from '../components';
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
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <ToyCard
                    title="Vendas Diárias"
                    colorTheme="primary"
                    style={styles.chartCard}
                >
                    <Text style={styles.chartSubtitle}>
                        Últimos {APP_CONFIG.CHART_DAYS_LIMIT} dias
                    </Text>
                    {chartData ? (
                        <LineChart
                            data={chartData}
                            width={screenWidth - (SPACING.lg * 3)}
                            height={220}
                            chartConfig={{
                                backgroundColor: COLORS.white,
                                backgroundGradientFrom: COLORS.white,
                                backgroundGradientTo: COLORS.white,
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(45, 52, 54, ${opacity})`,
                                style: {
                                    borderRadius: BORDER_RADIUS.md,
                                },
                                propsForDots: {
                                    r: '8',
                                    strokeWidth: '3',
                                    stroke: COLORS.primary,
                                    fill: COLORS.white,
                                },
                                propsForBackgroundLines: {
                                    strokeDasharray: '',
                                    stroke: COLORS.gray[200],
                                    strokeWidth: 1,
                                },
                            }}
                            bezier
                            style={styles.chart}
                            withHorizontalLabels={true}
                            withVerticalLabels={true}
                            withDots={true}
                            withInnerLines={true}
                            withOuterLines={false}
                        />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>
                                Nenhum dado disponível ainda
                            </Text>
                            <Text style={styles.noDataSubtext}>
                                As vendas aparecerão aqui quando houver dados
                            </Text>
                        </View>
                    )}
                </ToyCard>

                {data?.clientStats && (
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>Top Clientes</Text>

                        <StatCard
                            title="Maior Volume Total"
                            value={formatCurrency(data.clientStats.topVolumeClient?.total_volume || 0)}
                            subtitle={data.clientStats.topVolumeClient?.name || 'N/A'}
                            icon="💰"
                            colorTheme="green"
                        />

                        <StatCard
                            title="Maior Ticket Médio"
                            value={formatCurrency(data.clientStats.topAverageClient?.average_value || 0)}
                            subtitle={data.clientStats.topAverageClient?.name || 'N/A'}
                            icon="🎯"
                            colorTheme="blue"
                        />

                        <StatCard
                            title="Cliente Mais Frequente"
                            value={`${data.clientStats.topFrequencyClient?.unique_days || 0} dias`}
                            subtitle={data.clientStats.topFrequencyClient?.name || 'N/A'}
                            icon="⭐"
                            colorTheme="yellow"
                        />
                    </View>
                )}

                <View style={styles.bottomSpacing} />
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
        flex: 1,
    },
    chartCard: {
        margin: SPACING.lg,
        marginTop: SPACING.md,
    },
    chartSubtitle: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.secondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
    },
    chart: {
        marginVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignSelf: 'center',
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    noDataIcon: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    noDataText: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.semiBold,
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    noDataSubtext: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    statsSection: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.md,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSizes.xl,
        fontWeight: TYPOGRAPHY.fontWeights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    bottomSpacing: {
        height: SPACING.xl,
    },
});

export default StatsScreen;
