import express from 'express';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.patch('/read-all', verifyToken, markAllRead);
router.patch('/:id/read', verifyToken, markAsRead);

export default router;
