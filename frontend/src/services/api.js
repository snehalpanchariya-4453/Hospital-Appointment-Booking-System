import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, we can optionally clear token
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        // Token invalid or expired
        localStorage.removeItem('hospital_token');
        localStorage.removeItem('hospital_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (profileData) => API.put('/auth/profile', profileData),
};

// Department Services
export const departmentService = {
  getDepartments: (params) => API.get('/departments', { params }),
  getDepartment: (id) => API.get(`/departments/${id}`),
  createDepartment: (data) => API.post('/departments', data),
  updateDepartment: (id, data) => API.put(`/departments/${id}`, data),
  deleteDepartment: (id) => API.delete(`/departments/${id}`),
};

// Doctor Services
export const doctorService = {
  getDoctors: (params) => API.get('/doctors', { params }),
  getDoctor: (id) => API.get(`/doctors/${id}`),
  getMyProfile: () => API.get('/doctors/profile/me'),
  updateDoctor: (id, data) => API.put(`/doctors/${id}`, data),
  updateAvailability: (data) => API.put('/doctors/availability/update', data),
};

// Appointment Services
export const appointmentService = {
  getAvailableSlots: (doctorId, date) =>
    API.get('/appointments/available-slots', { params: { doctorId, date } }),
  bookAppointment: (bookingData) => API.post('/appointments', bookingData),
  getAppointments: (params) => API.get('/appointments', { params }),
  getAppointment: (id) => API.get(`/appointments/${id}`),
  updateStatus: (id, data) => API.put(`/appointments/${id}/status`, data),
  cancelAppointment: (id, cancellationReason) =>
    API.put(`/appointments/${id}/cancel`, { cancellationReason }),
  rescheduleAppointment: (id, rescheduleData) =>
    API.put(`/appointments/${id}/reschedule`, rescheduleData),
};

// Admin Services
export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getPatients: (params) => API.get('/admin/patients', { params }),
  toggleUserStatus: (userId) => API.put(`/admin/users/${userId}/toggle-status`),
  createDoctor: (doctorData) => API.post('/admin/doctors', doctorData),
  deleteDoctor: (doctorId) => API.delete(`/admin/doctors/${doctorId}`),
};

export default API;
