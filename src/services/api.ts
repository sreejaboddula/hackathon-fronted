import axios from 'axios';
import { SendOTPRequest, VerifyOTPRequest, User, Vendor } from '@/types/auth';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const sendOTP = (data: SendOTPRequest) => {
  return api.post('/auth/send-otp', data);
};

export const verifyOTP = async (phone: string, otp: string) => {
  const response = await api.post('/auth/verify-otp', { to: phone, code: otp });
  return response.data;
};

export const checkRegistrationStatus = async (phone: string) => {
  try {
    const response = await api.get(`/auth/registration-status?phone=${phone}`);
    return response.data.isRegistered;
  } catch (error) {
    return false;
  }
};

export const registerUser = (userData: User) => {
  return api.post('/auth/register/user', userData);
};

export const loginUser = async (phone: string, code: string) => {
  const response = await api.post('/auth/login/user', { phone, code });
  // Store the token
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userType', 'worker');
  }
  return response.data;
};

export const registerVendor = (vendorData: Vendor) => {
  return api.post('/auth/register/vendor', vendorData);
};

export const loginVendor = async (phone: string, code: string) => {
  const response = await api.post('/auth/login/vendor', { phone, code });
  // Store the token
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userType', 'employer');
  }
  return response.data;
};

// Worker APIs
export const getWorkerProfile = () => {
  return api.get('/worker/profile');
};

export const getAvailableJobs = () => {
  return api.get('/worker/jobs/available');
};

export const applyForJob = (jobId: string) => {
  return api.post(`/worker/jobs/${jobId}/apply`);
};

export const getWorkerApplications = () => {
  return api.get('/worker/applications');
};

export const getJobOffers = () => {
  return api.get('/worker/offers');
};

export const respondToOffer = (offerId: string, response: 'accepted' | 'rejected') => {
  return api.post(`/worker/offers/${offerId}/respond`, { response });
};

// Employer APIs
export const getEmployerProfile = () => {
  return api.get('/employer/profile');
};

export const getWorkersByCategory = (category: string) => {
  return api.get(`/employer/workers/${category}`);
};

export const sendJobOffer = (offerData: {
  workerID: string;
  title: string;
  description: string;
  salary: number;
  budget: number;
  duration: string;
  location: {
    type: string;
    coordinates: number[];
    address: {
      city: string;
      state: string;
      pincode: string;
      fullAddress: string;
    };
  };
  requiredSkills: string[];
  workingHours: {
    from: string;
    to: string;
    isFlexible: boolean;
  };
  benefits: string[];
  startDate: string;
  endDate: string;
}) => {
  return api.post('/employer/offers', offerData);
};

export const publishJob = (jobData: {
  jobTitle: string;
  description: string;
  salary: {
    amount: number;
    period: string;
  };
  budget: string;
  duration: string;
  location: {
    type: string;
    coordinates: number[];
    address: {
      city: string;
      state: string;
      pincode: string;
      fullAddress: string;
    };
  };
  category: string;
  requiredSkills: Array<{
    skill: string;
    experienceYears: number;
  }>;
  workingHours: {
    from: string;
    to: string;
    isFlexible: boolean;
  };
  benefits: string[];
  startDate: string;
  endDate: string;
}) => {
  return api.post('/employer/jobs', jobData);
};

// Document APIs
export const uploadAadhaar = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/documents/aadhaar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadSkillProof = (file: File, skill: string, certificateType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('skill', skill);
  formData.append('certificateType', certificateType);
  return api.post('/documents/skill-proof', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api; 