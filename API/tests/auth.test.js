const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/database');
const migrate = require('../src/database/migrate');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await db.connect();
        await migrate();
    });

    afterAll(async () => {
        db.close();
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toBe('admin');
        });

        it('should fail with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
        });

        it('should fail with missing username', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'admin123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('should fail with missing password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });
});
