import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
async function testConnection() {
  try {
    await pool.getConnection();
    console.log('Подключение к базе данных успешно!');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
}
testConnection();
export default pool;