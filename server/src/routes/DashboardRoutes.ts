import express from 'express';
import { getDashboardData, updateUserDashboardId, createDashboardData } from '../controller/DashboardController';

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.patch('/dashboard/user', updateUserDashboardId);
router.post('/dashboard', createDashboardData);

export default router;
