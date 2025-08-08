import pool from '../db.js';

export async function getFriends(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.birth_date, u.email
             FROM friends f
             JOIN users u ON f.friend_id = u.id
             WHERE f.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Ошибка получения друзей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

export async function addFriendLink(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
  const userId = req.user.id;
  const friendLink = `${process.env.FRONTEND_URL}friends/add/${userId}`;
  res.json({ friendLink });
}

export async function acceptFriend(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
  const userId = req.user.id;
  const friendId = parseInt(req.params.id, 10);
  if (isNaN(friendId)) {
    return res.status(400).json({ message: 'Неверный идентификатор пользователя' });
  }
  if (friendId === userId) return res.status(400).json({ message: 'Нельзя добавить себя в друзья' });
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [friendId]);
    if (users.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    const [existing] = await pool.query('SELECT * FROM friends WHERE user_id = ? AND friend_id = ?', [userId, friendId]);
    if (existing.length > 0) return res.status(400).json({ message: 'Вы уже друзья' });
    await pool.query('INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)', [userId, friendId, friendId, userId]);
    res.json({ message: 'Вы стали друзьями' });
  } catch (err) {
    console.error('Ошибка добавления в друзья:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

export async function removeFriend(req, res) {
  const userId = req.user.id;
  const friendId = parseInt(req.params.id, 10);
  if (isNaN(friendId)) {
    return res.status(400).json({ message: 'Неверный идентификатор пользователя' });
  }
  if (friendId === userId) {
    return res.status(400).json({ message: 'Нельзя удалить себя' });
  }
  try {
    await pool.query(
      'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [userId, friendId, friendId, userId]
    );
    res.json({ message: 'Друг удалён' });
  } catch (err) {
    console.error('Ошибка удаления друга:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

export async function getUserById(req, res) {
  const friendId = parseInt(req.params.id, 10);
  if (isNaN(friendId)) {
    return res.status(400).json({ message: 'Неверный идентификатор пользователя' });
  }
  try {
    const [rows] = await pool.query('SELECT id, email FROM users WHERE id = ?', [friendId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}