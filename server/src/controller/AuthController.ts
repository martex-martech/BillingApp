import { Request, Response } from 'express';
import { sendEmailWithOTP, verifyOTP } from '../utils/helper';
import User from '../Models/User';
import Dashboard from '../Models/dashbord';

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'bersinberz04@gmail.com',
    pass: process.env.SMTP_PASS || 'prsr ywcg jcji kmuw'
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
    console.error('❌ Error sending OTP email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOTPController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, otpId } = req.body;
    console.log('Verifying OTP for email:', email);
    const result = await verifyOTP(email, otp, otpId);
    console.log('OTP verification result:', result);

    if (result.success) {
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        user = new User({ email: email.toLowerCase() });
        await user.save();

        if (!user.dashboardDataId) {
          console.log('Creating sample dashboard for new user:', user.email);
          const sampleDashboard = new Dashboard({
            todaySale: 0,
            receivable: 0,
            lowStockItems: 0
          });
          try {
            const savedDashboard = await sampleDashboard.save();
            console.log('Sample dashboard created with id:', savedDashboard._id);
            user.dashboardDataId = savedDashboard._id as any;
            await user.save();
            console.log('User updated with dashboardDataId:', user.dashboardDataId);
          } catch (err) {
            console.error('Error saving sample dashboard or updating user:', err);
          }
        }
      }
    }

    res.json(result);
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
