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

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface RegistrationForm {
  basicInfo: BasicInfo;
  documentInfo: DocumentInfo;
  skillInfo: SkillInfo;
} 