import jwt from 'jsonwebtoken' // библиотека для работы с токенами
// Создание токена: const token = jwt.sign(objData, secretKey, options);
// Проверка токена: const decoded = jwt.verify(token, secretKey);

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // 'Authorization': `Bearer ${token}`
  if (!authHeader) return res.status(401).json({ message: 'Нет токена' });   // 401 статус - неавторизованный доступ
  const token = authHeader.split(' ')[1]; // Bearer ${token}
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user.id, user.role, user.email
    next();
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
}