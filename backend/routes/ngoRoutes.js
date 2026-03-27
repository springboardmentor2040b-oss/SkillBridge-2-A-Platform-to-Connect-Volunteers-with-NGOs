import express from 'express';
import { getNgoDetails, addNgoMember, removeNgoMember } from '../controllers/ngoController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getNgoDetails);
router.post('/members', verifyToken, addNgoMember);
router.delete('/members/:id', verifyToken, removeNgoMember);

export default router;

