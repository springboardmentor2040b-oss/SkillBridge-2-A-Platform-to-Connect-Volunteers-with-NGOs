import express from 'express';
import { createOpportunity, getAllOpportunities, getMyOpportunities } from '../controllers/opportunityController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOpportunity);
router.get('/my-opportunities', verifyToken, getMyOpportunities);
router.get('/', getAllOpportunities);

export default router;
