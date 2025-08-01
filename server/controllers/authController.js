import pool from '../db.js'
import bcrypt from 'bcrypt' // библиотека для хеширования паролей
// Хеширование пароля: const hashedPassword = await bcrypt.hash(password, 10); 
// Сравнение хеша с паролем (true/false): const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
import jwt from 'jsonwebtoken' // библиотека для работы с токенами
// Создание токена: const token = jwt.sign(objData, secretKey, options);
// Проверка токена: const decoded = jwt.verify(token, secretKey);
import dotenv from 'dotenv' // библиотека для работы с окружением .env
dotenv.config(); // загрузка переменных из окружения .env

export async function register(req, res) {
    // const email = req.body.email;
    // const fullName = req.body.fullName;
    // const birthDate = req.body.birthDate;
    // const password = req.body.password;
    const { email, full_name, birth_date, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email =?', [email]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ message: 'Электронная почта уже существует' });
        }   // 400 статус - некорекктный запрос
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (email, full_name, birth_date, password_hash) VALUES (?, ?, ?, ?)',
            [email, full_name, birth_date, hashedPassword]
        );
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });   // 201 статус - создан ресурс
    } catch (err) {
        console.error('Ошибка регистрации пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });   // 500 статус - неожиданная ошибка
    }
}

export async function login(req, res) {
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Неверные учетные данные' });   // 400 статус - некорекктный запрос
        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ message: 'Неверные учетные данные' });   // 400 статус - некорекктный запрос
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' }
        );
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Ошибка авторизации пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });   // 500 статус - неожиданная ошибка
    }
}