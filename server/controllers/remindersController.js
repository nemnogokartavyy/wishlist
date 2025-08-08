import pool from '../db.js';

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getUserReminders(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
  const todayDate = new Date();
  const todayStr = getLocalDateString(todayDate);
  try {
    const [count] = await pool.query(
      `SELECT COUNT(*) AS cnt FROM reminders WHERE user_id = ? AND remind_date >= ?`,
      [userId, todayStr]
    );
    const [reminders] = await pool.query(
      `SELECT r.id, u.full_name, u.birth_date, r.remind_date
      FROM reminders r
      LEFT JOIN users u ON r.friend_id = u.id
      WHERE r.user_id = ? AND DATE(r.remind_date) >= DATE(?)
      ORDER BY r.remind_date ASC`,
      [userId, todayStr]
    );
    res.json(reminders);
  } catch (err) {
    console.error('Ошибка получения напоминаний:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

export async function generateReminders(userId) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const todayStr = getLocalDateString(today);
  const nextWeekStr = getLocalDateString(nextWeek);
  await pool.query(`DELETE FROM reminders WHERE remind_date < ? AND user_id = ?`, [todayStr, userId]);
  const [friends] = await pool.query(`
    SELECT f.user_id, u.id AS friend_id, u.full_name, u.birth_date
    FROM friends f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = ?`, [userId]
  );
  if (friends.length === 0) {
    return;
  }
  for (const friend of friends) {
    if (!friend.birth_date) {
      continue;
    }
    const birthDate = new Date(friend.birth_date);
    let birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1);
    }
    if (birthdayThisYear >= today && birthdayThisYear <= nextWeek) {
      const remindDateStr = getLocalDateString(birthdayThisYear);
      const [existing] = await pool.query(
        `SELECT * FROM reminders WHERE user_id = ? AND friend_id = ? AND remind_date = ?`,
        [friend.user_id, friend.friend_id, remindDateStr]
      );
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO reminders (user_id, friend_id, remind_date, created_at) VALUES (?, ?, ?, NOW())`,
          [friend.user_id, friend.friend_id, remindDateStr]
        );
      } else {
      }
    } else {
    }
  }
}

export async function generateRemindersForUpcomingBirthdays(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    await generateReminders(userId);
    res.json({ message: 'Напоминания сгенерированы' });
  } catch (err) {
    console.error('Ошибка генерации напоминаний:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}