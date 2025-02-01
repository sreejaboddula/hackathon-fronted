import axios from 'axios';
import { BasicInfo, DocumentInfo, SkillInfo, SendOtpRequest, VerifyOtpRequest } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  async sendOtp(data: SendOtpRequest) {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest) {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  async registerBasicInfo(data: BasicInfo) {
    const response = await api.post('/auth/register/basic', data);
    return response.data;
  },

  async registerDocumentInfo(data: FormData) {
    const response = await api.post('/auth/register/documents', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async registerSkillInfo(data: FormData) {
    const response = await api.post('/auth/register/skills', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Add an interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data.message || 'Something went wrong';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
);

export default api; 