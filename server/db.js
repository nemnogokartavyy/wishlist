import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
async function testConnection() {
  try {
    await pool.getConnection(); // проверить соединение явно
    console.log('Подключение к базе данных успешно!');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
}
testConnection();
export default pool;