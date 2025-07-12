import axiosInstance from '../axiosInstance';

interface AdminData {
  email: string;
  role: string;
  plan: string;
  expiry: string;
}

interface StatusUpdatePayload {
  status: 'active' | 'inactive' | 'trial_expired';
}

interface RoleUpdatePayload {
  role: 'admin' | 'staff' | 'superadmin';
}

export const createAdmin = async (admindata: AdminData) => {
  const res = await axiosInstance.post('/createadmin', admindata);
  return res.data;
};

export const getAllUsers = async (filter = 'all') => {
  const response = await axiosInstance.get(`/adminusers?filter=${filter}`);
  return Array.isArray(response.data) ? response.data : response.data.users;
};

export const updateUserStatus = async (userId: string, status: StatusUpdatePayload) => {
  const response = await axiosInstance.put(`/updateStatusUsers/${userId}`, status);
  return response.data;
};

export const updateUserRole = async (userId: string, role: RoleUpdatePayload) => {
  const response = await axiosInstance.put(`/updateRoleUsers/${userId}`, role);
  return response.data;
};

export const deleteAdmin = async (userId: string) => {
  const response = await axiosInstance.delete(`/deleteAdminUsers/${userId}`);
  return response.data;
};