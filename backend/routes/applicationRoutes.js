import express from 'express';
import {
    applyToOpportunity,
    getMyApplications,
    getNGOApplications,
    updateApplicationStatus,
} from '../controllers/applicationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:opportunityId', verifyToken, applyToOpportunity);
router.get('/my', verifyToken, getMyApplications);
router.get('/ngo', verifyToken, getNGOApplications);
router.patch('/:id/status', verifyToken, updateApplicationStatus);

export default router;
