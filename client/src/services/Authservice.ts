import axiosInstance from "./axiosInstance";

export const AuthService = {
  sendOtp: async (email: string) => {
    const response = await axiosInstance.post('/send-otp', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string, otpId: string) => {
    const response = await axiosInstance.post('/verify-otp', {
      email,
      otp,
      otpId
    });
    return response.data;
  }
};
