import express from 'express';
import { createAdminUser, deleteAdmin, getAdminUsers, updateUserRole, updateUserStatus } from '../controller/superadminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/createadmin',authMiddleware, createAdminUser);
router.get('/adminusers', authMiddleware, getAdminUsers);
router.put('/updateStatusUsers/:userId', authMiddleware, updateUserStatus);
router.put('/updateRoleUsers/:userId', authMiddleware, updateUserRole);
router.delete('/deleteAdminUsers/:userId', authMiddleware, deleteAdmin);


export default router;