import { Router } from 'express';
import { sendOTP, verifyOTPController } from '../controller/AuthController';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);

export default router;