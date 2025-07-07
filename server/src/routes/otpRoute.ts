import { Router } from 'express';
import { sendOTP, verifyOTPController } from '../controller/otpController';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);

export default router;