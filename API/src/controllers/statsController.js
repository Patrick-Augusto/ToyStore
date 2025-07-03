const db = require('../database/database');

// Estatísticas de vendas por dia
const getSalesByDay = async (req, res) => {
    try {
        const salesByDay = await db.all(`
      SELECT 
        sale_date,
        SUM(value) as total_sales,
        COUNT(*) as total_transactions
      FROM sales 
      GROUP BY sale_date 
      ORDER BY sale_date
    `);

        res.json(salesByDay);
    } catch (error) {
        console.error('Erro ao buscar vendas por dia:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Estatísticas de clientes
const getClientStats = async (req, res) => {
    try {
        // Cliente com maior volume de vendas
        const topVolumeClient = await db.get(`
      SELECT 
        c.id,
        c.name,
        c.email,
        SUM(s.value) as total_volume
      FROM clients c
      JOIN sales s ON c.id = s.client_id
      GROUP BY c.id, c.name, c.email
      ORDER BY total_volume DESC
      LIMIT 1
    `);

        // Cliente com maior média de valor por venda
        const topAverageClient = await db.get(`
      SELECT 
        c.id,
        c.name,
        c.email,
        AVG(s.value) as average_value,
        COUNT(s.id) as total_sales
      FROM clients c
      JOIN sales s ON c.id = s.client_id
      GROUP BY c.id, c.name, c.email
      ORDER BY average_value DESC
      LIMIT 1
    `);

        // Cliente com maior frequência de compras (dias únicos)
        const topFrequencyClient = await db.get(`
      SELECT 
        c.id,
        c.name,
        c.email,
        COUNT(DISTINCT s.sale_date) as unique_days,
        COUNT(s.id) as total_sales
      FROM clients c
      JOIN sales s ON c.id = s.client_id
      GROUP BY c.id, c.name, c.email
      ORDER BY unique_days DESC
      LIMIT 1
    `);

        res.json({
            topVolumeClient: topVolumeClient || null,
            topAverageClient: topAverageClient || null,
            topFrequencyClient: topFrequencyClient || null
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas de clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Estatísticas gerais
const getGeneralStats = async (req, res) => {
    try {
        const totalClients = await db.get('SELECT COUNT(*) as count FROM clients');
        const totalSales = await db.get('SELECT COUNT(*) as count, SUM(value) as total FROM sales');
        const avgSaleValue = await db.get('SELECT AVG(value) as average FROM sales');

        res.json({
            totalClients: totalClients.count,
            totalSales: totalSales.count,
            totalRevenue: totalSales.total || 0,
            averageSaleValue: avgSaleValue.average || 0
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas gerais:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = {
    getSalesByDay,
    getClientStats,
    getGeneralStats
};
