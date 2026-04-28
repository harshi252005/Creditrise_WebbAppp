import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  verifyOtp: (data) => api.post('/verify-otp', data),
  resetPassword: (data) => api.post('/reset-password', data),
};

export const dataService = {
  addEmi: (userId, data) => api.post('/add-emi', { ...data, user_id: userId }),
  updateEmiStatus: (emiId, points) => api.post('/pay-emi', { emi_id: emiId, points: points || 0 }),
  payEmi: (emiId, points) => api.post('/pay-emi', { emi_id: emiId, points: points || 0 }),
  getProfile: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (userId, data) => api.post(`/update-profile/${userId}`, data),
  getCreditHistory: (userId) => api.get(`/credit-history/${userId}`),
  getNotifications: (userId) => api.get(`/notifications/${userId}`),
  predictScore: (data) => api.post('/predict_credit_score', data),
  simulateScore: (data) => api.post('/score-simulator', data),
  getGrowthPrediction: (userId, months) => api.get(`/growth-predictor/${userId}?months=${months}`),
  getAiAdvisor: (userId) => api.get(`/ai-advisor/${userId}`),
  getRiskAnalysis: (userId) => api.get(`/risk-analysis/${userId}`),
  getFinancialHealth: (userId) => api.get(`/financial-health/${userId}`),
  getAiCreditPlanner: (userId) => api.get(`/ai-credit-planner/${userId}`),
  uploadReceipt: (formData) => api.post('/upload_receipt', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }),
  changePassword: (data) => api.post('/change-password', data),
  deleteAccount: (userId) => api.delete('/delete-account', { data: { user_id: userId } }),
  getDashboard: (userId) => api.get(`/dashboard/${userId}`),
};

export default api;




