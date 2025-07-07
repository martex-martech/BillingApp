import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface OTPRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  id: string;
}

// In-memory storage (replace with Redis/database in production)
const otpStorage: Record<string, OTPRecord> = {};

export const sendEmailWithOTP = async (
  email: string,
  smtpConfig: SMTPConfig,
  otpExpiryMinutes: number = 5
) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + otpExpiryMinutes * 60 * 1000;
    const otpId = uuidv4();

    otpStorage[email] = {
      otp,
      expiresAt,
      attempts: 0,
      id: otpId
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
      ...smtpConfig,
      logger: process.env.NODE_ENV !== 'production',
      pool: true
    });

    // Send email
    await transporter.sendMail({
      from: `"Billing App" <${smtpConfig.auth.user}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your OTP code is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Verification Code</h2>
          <p>Your one-time verification code is:</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; 
              font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 16px 0;">
            ${otp}
          </div>
          <p>This code will expire in ${otpExpiryMinutes} minutes.</p>
          <p style="font-size: 12px; color: #6b7280;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    });

    return { success: true, otpId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const verifyOTP = (
  email: string,
  userOTP: string,
  otpId?: string
) => {
  const record = otpStorage[email];

  if (!record) return { success: false, message: 'OTP not found or expired' };
  if (record.expiresAt < Date.now()) {
    delete otpStorage[email];
    return { success: false, message: 'OTP expired' };
  }
  if (otpId && record.id !== otpId) {
    return { success: false, message: 'Invalid OTP session' };
  }

  // Check attempts
  if (record.attempts >= 3) {
    delete otpStorage[email];
    return { success: false, message: 'Too many attempts' };
  }

  // Verify OTP
  if (record.otp !== userOTP) {
    record.attempts += 1;
    return { success: false, message: 'Invalid OTP' };
  }

  // OTP verified - clean up
  delete otpStorage[email];
  return { success: true, message: 'OTP verified' };
};

// Optional: Cleanup expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(otpStorage).forEach(email => {
    if (otpStorage[email].expiresAt < now) {
      delete otpStorage[email];
    }
  });
}, 60 * 60 * 1000); // Run hourly