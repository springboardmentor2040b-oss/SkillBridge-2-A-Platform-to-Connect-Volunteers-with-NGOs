import express from 'express';
import {
  createOpportunity,
  getAllOpportunities,
  getMyOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} from '../controllers/opportunityController.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOpportunity);
router.get('/my-opportunities', verifyToken, getMyOpportunities);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);
router.put('/:id', verifyToken, updateOpportunity);
router.delete('/:id', verifyToken, deleteOpportunity);
router.put('/:id', verifyToken, updateOpportunity);

export default router;