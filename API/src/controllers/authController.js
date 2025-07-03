const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/database');

const login = [
    body('username').notEmpty().withMessage('Username é obrigatório'),
    body('password').notEmpty().withMessage('Password é obrigatório'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;

            const user = await db.get(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, user: { id: user.id, username: user.username } });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
];

module.exports = { login };
