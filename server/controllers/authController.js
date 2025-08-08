import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export async function register(req, res) {
    const { email, full_name, birth_date, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email =?', [email]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ message: 'Электронная почта уже существует' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (email, full_name, birth_date, password_hash) VALUES (?, ?, ?, ?)',
            [email, full_name, birth_date, hashedPassword]
        );
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (err) {
        console.error('Ошибка регистрации пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Неверные учетные данные' });
        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ message: 'Неверные учетные данные' });
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' }
        );
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Ошибка авторизации пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}