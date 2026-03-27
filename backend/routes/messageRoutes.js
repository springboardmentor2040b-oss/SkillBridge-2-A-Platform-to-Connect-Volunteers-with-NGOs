import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', verifyToken, getConversations);
router.get('/:conversationId', verifyToken, getMessages);
router.post('/:conversationId', verifyToken, sendMessage);

export default router;