import pool from '../db.js'

export async function getMyWishlist(req, res) {
    const userId = req.user.id; // получаем из запроса из токена при помощи authMiddleware
    try {
        const [rows] = await pool.query('SELECT * FROM wishlist WHERE user_id = ?', [userId]);
        res.json(rows);
    } catch (err) {
        console.error('Ошибка получения списка подарков:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function createGift(req, res) {
    const userId = req.user.id;
    const { giftName, comment, imageUrl, buyLink } = req.body;
    try {
        await pool.query(
            'INSERT INTO wishlist (user_id, gift_name, comment, image_url, buy_link) VALUES (?, ?, ?, ?, ?)',
            [userId, giftName, comment, imageUrl || null, buyLink || null]
        );
        res.status(201).json({ message: 'Подарок добавлен' });
    } catch (err) {
        console.error('Ошибка добавления подарка:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function updateGift(req, res) {
    const userId = req.user.id;
    const wishId = req.params.id;  // берем id из параметра из URL ссылки
    const { giftName, comment, imageUrl, buyLink } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE wishlist
             SET gift_name = ?, comment = ?, image_url = ?, buy_link = ?
             WHERE id = ? AND user_id = ?`,
            [giftName, comment, imageUrl || null, buyLink || null, wishId, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Подарок не найден' });
        }
        res.json({ message: 'Подарок обновлен' });
    } catch (err) {
        console.error('Ошибка обновления подарка:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function deleteGift(req, res) {
    const userId = req.user.id;
    const wishId = req.params.id;
    try {
        const [result] = await pool.query(
            'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
            [wishId, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Подарок не найден' });
        }
        res.json({ message: 'Подарок удалён' });
    } catch (err) {
        console.error('Ошибка удаления подарка:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function getWishlistByUserId(req, res) {
    const userId = parseInt(req.params.id);
    try {
        const [items] = await pool.query(
            `SELECT id, gift_name, comment, image_url, buy_link, created_at
       FROM wishlist WHERE user_id = ?`,
            [userId]
        );
        const giftIds = items.map(i => i.id);
        let marks = [];
        if (giftIds.length > 0) {
            const [marksRows] = await pool.query(
                `SELECT gift_id, user_id FROM gift_marks WHERE gift_id IN (?) AND canceled_at IS NULL`,
                [giftIds]
            );
            marks = marksRows;
        }
        const itemsWithMarks = items.map(item => {
            const mark = marks.find(m => m.gift_id === item.id);
            return {
                ...item,
                isMarked: Boolean(mark),
                markedBy: mark ? mark.user_id : null,
            };
        });
        res.json(itemsWithMarks);
    } catch (err) {
        console.error('Ошибка получения вишлиста:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function markGift(req, res) {
    const friendId = req.user.id;
    const giftId = req.params.id;
    try {
        const [existingMark] = await pool.query(
            'SELECT * FROM gift_marks WHERE gift_id = ? AND canceled_at IS NULL',
            [giftId]
        );
        if (existingMark.length > 0) {
            return res.status(400).json({ message: 'Подарок уже отмечен' });
        }
        await pool.query(
            'INSERT INTO gift_marks (gift_id, user_id, marked_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [giftId, friendId]
        );
        res.status(201).json({ message: 'Подарок отмечен' });
    } catch (err) {
        console.error('Ошибка отметки подарка:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

export async function unmarkGift(req, res) {
    const friendId = req.user.id;
    const giftId = req.params.id;
    try {
        const [markRows] = await pool.query(
            'SELECT * FROM gift_marks WHERE gift_id = ? AND user_id = ? AND canceled_at IS NULL',
            [giftId, friendId]
        );
        if (markRows.length === 0) {
            return res.status(404).json({ message: 'Отметка не найдена или уже отменена' });
        }
        const mark = markRows[0];
        const [giftRows] = await pool.query(
            'SELECT user_id FROM wishlist WHERE id = ?',
            [giftId]
        );
        if (giftRows.length === 0) {
            return res.status(404).json({ message: 'Подарок не найден' });
        }
        const ownerId = giftRows[0].user_id;
        const [userRows] = await pool.query(
            'SELECT birth_date FROM users WHERE id = ?',
            [ownerId]
        );
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        const birthday = new Date(userRows[0].birth_date);
        const now = new Date();
        const birthdayThisYear = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
        if (birthdayThisYear < now) {
            birthdayThisYear.setFullYear(now.getFullYear() + 1);
        }
        const limitDate = new Date(birthdayThisYear);
        limitDate.setDate(birthdayThisYear.getDate() - 2);
        // console.log(`День рождения в текущем (или следующем) году: ${birthdayThisYear}`);
        // console.log(`Лимит (birthday - 2 дня): ${limitDate}`);
        // console.log(`Сейчас: ${now}`);
        // console.log(`now > limitDate: ${now > limitDate}`);
        if (now > limitDate) {
            return res.status(400).json({ message: 'Снятие отметки невозможно — меньше 2 дней до дня рождения' });
        }
        await pool.query(
            'UPDATE gift_marks SET canceled_at = CURRENT_TIMESTAMP WHERE id = ?',
            [mark.id]
        );
        res.json({ message: 'Отметка снята' });
    } catch (err) {
        console.error('Ошибка снятия отметки:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}