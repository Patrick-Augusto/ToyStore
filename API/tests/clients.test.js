const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/database');
const migrate = require('../src/database/migrate');

describe('Client Endpoints', () => {
    let authToken;
    let clientId;

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

    describe('POST /api/clients', () => {
        it('should create a new client', async () => {
            const clientData = {
                name: 'João Silva',
                email: 'joao.silva@test.com',
                birth_date: '1990-01-01'
            };

            const res = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${authToken}`)
                .send(clientData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe(clientData.name);
            expect(res.body.email).toBe(clientData.email);

            clientId = res.body.id;
        });

        it('should fail without authentication', async () => {
            const clientData = {
                name: 'João Silva',
                email: 'joao.silva2@test.com',
                birth_date: '1990-01-01'
            };

            const res = await request(app)
                .post('/api/clients')
                .send(clientData);

            expect(res.statusCode).toBe(401);
        });

        it('should fail with invalid email', async () => {
            const clientData = {
                name: 'João Silva',
                email: 'invalid-email',
                birth_date: '1990-01-01'
            };

            const res = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${authToken}`)
                .send(clientData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('should fail with missing required fields', async () => {
            const res = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/clients', () => {
        it('should return clients list with specific format', async () => {
            const res = await request(app)
                .get('/api/clients')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('clientes');
            expect(res.body).toHaveProperty('meta');
            expect(res.body).toHaveProperty('redundante');
            expect(res.body.redundante.status).toBe('ok');

            if (res.body.data.clientes.length > 0) {
                const client = res.body.data.clientes[0];
                expect(client).toHaveProperty('info');
                expect(client.info).toHaveProperty('nomeCompleto');
                expect(client.info).toHaveProperty('detalhes');
                expect(client).toHaveProperty('estatisticas');
                expect(client.estatisticas).toHaveProperty('vendas');
            }
        });

        it('should filter clients by name', async () => {
            const res = await request(app)
                .get('/api/clients?name=João')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.clientes.every(client =>
                client.info.nomeCompleto.toLowerCase().includes('joão')
            )).toBe(true);
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/clients');

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/clients/:id', () => {
        it('should return client by id', async () => {
            const res = await request(app)
                .get(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body.id).toBe(clientId);
        });

        it('should return 404 for non-existent client', async () => {
            const res = await request(app)
                .get('/api/clients/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/clients/:id', () => {
        it('should update client', async () => {
            const updateData = {
                name: 'João Silva Updated',
                email: 'joao.silva.updated@test.com',
                birth_date: '1990-01-01'
            };

            const res = await request(app)
                .put(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.email).toBe(updateData.email);
        });

        it('should return 404 for non-existent client', async () => {
            const updateData = {
                name: 'João Silva',
                email: 'joao.silva@test.com',
                birth_date: '1990-01-01'
            };

            const res = await request(app)
                .put('/api/clients/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/clients/:id', () => {
        it('should delete client', async () => {
            const res = await request(app)
                .delete(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(204);
        });

        it('should return 404 for non-existent client', async () => {
            const res = await request(app)
                .delete('/api/clients/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
