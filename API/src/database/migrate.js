const db = require('./database');

async function migrate() {
    try {
        await db.connect();

        // Tabela de usuários para autenticação
        await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Tabela de clientes
        await db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Tabela de vendas
        await db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        sale_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      )
    `);

        // Inserir usuário padrão para teste
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        try {
            await db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                ['admin', hashedPassword]
            );
            console.log('Usuário admin criado');
        } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                throw err;
            }
        }

        // Inserir alguns clientes de exemplo
        const clients = [
            ['Ana Beatriz', 'ana.b@example.com', '1992-05-01'],
            ['Carlos Eduardo', 'cadu@example.com', '1987-08-15'],
            ['Maria Silva', 'maria@example.com', '1990-12-25'],
            ['João Pedro', 'joao@example.com', '1985-03-10']
        ];

        for (const client of clients) {
            try {
                const result = await db.run(
                    'INSERT INTO clients (name, email, birth_date) VALUES (?, ?, ?)',
                    client
                );

                // Inserir algumas vendas de exemplo
                const salesData = [
                    [result.id, 150.00, '2024-01-01'],
                    [result.id, 75.50, '2024-01-15'],
                    [result.id, 200.00, '2024-02-01']
                ];

                for (const sale of salesData) {
                    await db.run(
                        'INSERT INTO sales (client_id, value, sale_date) VALUES (?, ?, ?)',
                        sale
                    );
                }
            } catch (err) {
                if (!err.message.includes('UNIQUE constraint failed')) {
                    console.error('Erro ao inserir cliente:', err.message);
                }
            }
        }

        console.log('Migração concluída com sucesso!');
    } catch (error) {
        console.error('Erro na migração:', error);
    }
}

if (require.main === module) {
    migrate().then(() => {
        process.exit(0);
    });
}

module.exports = migrate;
