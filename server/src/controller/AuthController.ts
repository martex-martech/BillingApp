import { sendEmailWithOTP, verifyOTP } from '../utils/helper';
import User from '../Models/User';
import jwt from 'jsonwebtoken';

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'bersinberz04@gmail.com',
    pass: process.env.SMTP_PASS || 'prsr ywcg jcji kmuw'
  }
};

export const sendOTP = async (req: any, res: any): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not registered' });
    }

    const { success, otpId } = await sendEmailWithOTP(email, smtpConfig);

    if (success) {
      res.json({ success: true, otpId });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOTPController = async (req: any, res: any): Promise<void> => {
  try {
    const { email, otp, otpId } = req.body;

    const result = await verifyOTP(email, otp, otpId);
    if (!result.success) return res.status(401).json(result);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not registered' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.json({ success: true, message: 'OTP verified', token, user });
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
