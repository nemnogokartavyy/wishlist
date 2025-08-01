import express from 'express';
import { getUserReminders, generateRemindersForUpcomingBirthdays } from '../controllers/remindersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', authMiddleware, getUserReminders);
router.post('/generate', authMiddleware, generateRemindersForUpcomingBirthdays);
export default router;