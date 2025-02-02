export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: {
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
  };
}

export interface WorkingHours {
  from: string;
  to: string;
  isFlexible: boolean;
}

export interface Job {
  id: string;
  jobTitle: string;
  description: string;
  salary: {
    amount: number;
    period: string;
  };
  budget: string;
  duration: string;
  location: Location;
  category: string;
  requiredSkills: Array<{
    skill: string;
    experienceYears: number;
  }>;
  workingHours: WorkingHours;
  benefits: string[];
  startDate: string;
  endDate: string;
}

export interface Offer extends Omit<Job, 'jobTitle'> {
  title: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  category: string;
  skills: string[];
  currentLocation: Location;
}

export interface VendorProfile {
  name: string;
  phone: string;
  email: string;
  businessType: string;
  location: Location;
}

export interface AdminProfile {
  name: string;
  phone: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
} 