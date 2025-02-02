export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface BasicInfo {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface DocumentInfo {
  aadhaarNumber: string;
  aadhaarDocument: File;
  address: Address;
}

export interface SkillInfo {
  skills: string[];
  verificationVideo: File;
}

export interface SendOTPRequest {
  to: string;
  channel: 'sms' | 'email';
}

export interface VerifyOTPRequest {
  to: string;
  code: string;
}

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: string;
  category: string;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: Address;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  aadhaarNumber: string;
  category: string;
  currentLocation: Location;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  education: string;
  languagesSpoken: string[];
  skills: string[];
  experience: string;
  hourlyRate: number;
  availability: 'Immediately' | 'Within 1 Week' | 'Within 1 Month';
  preferredCommunication: {
    email: boolean;
    sms: boolean;
    phoneCall: boolean;
  };
}

export interface OrganizationDetails {
  companyName: string;
  companyRegistrationNumber: string;
  gstNumber: string;
  address: Address;
  businessProof?: string;
  registrationCertificate?: string;
}

export interface IndividualDetails {
  occupation: string;
  experienceYears: number;
  skills: string[];
  workSamples?: string[];
  identityProof?: string;
}

export interface Vendor {
  vendorType: 'organization' | 'individual';
  vendorName: string;
  phone: string;
  email: string;
  aadhaarNumber: string;
  category: string;
  currentLocation: Location;
  organizationDetails?: OrganizationDetails;
  individualDetails?: IndividualDetails;
}

export interface RegistrationForm {
  basicInfo: BasicInfo;
  documentInfo: DocumentInfo;
  skillInfo: SkillInfo;
} 