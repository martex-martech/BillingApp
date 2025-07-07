import { Request, Response } from 'express';
import { sendEmailWithOTP, verifyOTP } from '../utils/helper';

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'bersinberz04@gmail.com',
    pass: process.env.SMTP_PASS || 'svik quph lyku yljf '
  }
};

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const { success, otpId } = await sendEmailWithOTP(email, smtpConfig);
    
    if (success) {
      res.json({ success: true, otpId });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOTPController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, otpId } = req.body;
    const result = verifyOTP(email, otp, otpId);
    res.json(result);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
