const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/database');
const migrate = require('../src/database/migrate');

describe('Stats Endpoints', () => {
    let authToken;

    beforeAll(async () => {
        await db.connect();
        await migrate();

        // Login para obter token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'admin',
                password: 'admin123'
            });

        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        db.close();
    });

    describe('GET /api/stats/sales-by-day', () => {
        it('should return sales by day', async () => {
            const res = await request(app)
                .get('/api/stats/sales-by-day')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('sale_date');
                expect(res.body[0]).toHaveProperty('total_sales');
                expect(res.body[0]).toHaveProperty('total_transactions');
            }
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/stats/sales-by-day');

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/stats/client-stats', () => {
        it('should return client statistics', async () => {
            const res = await request(app)
                .get('/api/stats/client-stats')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('topVolumeClient');
            expect(res.body).toHaveProperty('topAverageClient');
            expect(res.body).toHaveProperty('topFrequencyClient');
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/stats/client-stats');

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/stats/general', () => {
        it('should return general statistics', async () => {
            const res = await request(app)
                .get('/api/stats/general')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalClients');
            expect(res.body).toHaveProperty('totalSales');
            expect(res.body).toHaveProperty('totalRevenue');
            expect(res.body).toHaveProperty('averageSaleValue');
            expect(typeof res.body.totalClients).toBe('number');
            expect(typeof res.body.totalSales).toBe('number');
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/stats/general');

            expect(res.statusCode).toBe(401);
        });
    });
});
