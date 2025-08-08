import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'
import pool from './db.js'
import authRoutes from './routes/auth.js'
import friendsRouter from './routes/friends.js'
import wishlistRoutes from './routes/wishlist.js'
import remindersRouter from './routes/reminders.js'
import { generateReminders } from './controllers/remindersController.js'

dotenv.config();

async function generateRemindersForAllUsers() {
    const [users] = await pool.query(`SELECT DISTINCT user_id FROM friends`);
    for (const user of users) {
        await generateReminders(user.user_id);
    }
}

cron.schedule('0 0 * * *', async () => {
    try {
        await generateRemindersForAllUsers();
    } catch (err) {
        console.error('Ошибка при генерации напоминаний в cron:', err);
    }
});

const corsOptions = {
    origin: ['http://45.151.144.210', 'http://localhost:3000', 'http://localhost:5173', 'http://wishlist.fed.by', 'https://wishlist.fed.by', 'http://www.wishlist.fed.by', 'https://www.wishlist.fed.by'],
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    next();
});
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/friends', friendsRouter);
app.use('/api/reminders', remindersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => console.log(`Сервер запущен на порту ${PORT}`));
