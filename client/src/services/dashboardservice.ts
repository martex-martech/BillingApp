import axiosInstance from "./axiosInstance";

export interface DashboardData {
  todaySale: number;
  receivable: number;
  lowStockItems: number;
}

// GET dashboard data
export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await axiosInstance.get<DashboardData>('/dashboard');
  return response.data;
};