'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendOTP, verifyOTP, registerUser, registerVendor } from '@/services/api';
import type { User, Vendor } from '@/types/auth';

type UserType = 'worker' | 'employer';
type Step = 'type' | 'phone' | 'otp' | 'details';

// Form validation schemas
const phoneSchema = z.object({
  phone: z.string().min(10).max(10).regex(/^\d+$/, 'Must be a valid phone number'),
});

const otpSchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/, 'Must be a valid OTP'),
});

const workerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be 10 digits'),
  category: z.string().min(1, 'Category is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  currentLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.object({
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      pincode: z.string().min(6, 'Valid pincode is required'),
      fullAddress: z.string().min(1, 'Full address is required'),
    }),
  }),
  aadhaarNumber: z.string().min(12, 'Aadhaar number must be 12 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  education: z.string().min(1, 'Education is required'),
  languagesSpoken: z.array(z.string()).min(1, 'At least one language is required'),
  experience: z.string().min(1, 'Experience is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  availability: z.enum(['Immediately', 'Within 1 Week', 'Within 1 Month']),
  preferredCommunication: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    phoneCall: z.boolean(),
  }),
});

const vendorSchema = z.object({
  vendorType: z.enum(['organization', 'individual']),
  vendorName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be 10 digits'),
  aadhaarNumber: z.string().min(12, 'Aadhaar number must be 12 digits'),
  category: z.string().min(1, 'Category is required'),
  currentLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.object({
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      pincode: z.string().min(6, 'Valid pincode is required'),
      fullAddress: z.string().min(1, 'Full address is required'),
    }),
  }),
  organizationDetails: z.object({
    companyName: z.string().optional(),
    companyRegistrationNumber: z.string().optional(),
    gstNumber: z.string().optional(),
    address: z.object({
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      fullAddress: z.string(),
    }).optional(),
  }).optional(),
  individualDetails: z.object({
    occupation: z.string().optional(),
    experienceYears: z.number().optional(),
    skills: z.array(z.string()).optional(),
  }).optional(),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type WorkerFormData = z.infer<typeof workerSchema>;
type VendorFormData = z.infer<typeof vendorSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState<Step>('type');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const workerForm = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0],
        address: {
          city: '',
          state: '',
          pincode: '',
          fullAddress: '',
        },
      },
      preferredCommunication: {
        email: true,
        sms: true,
        phoneCall: false,
      },
    },
  });

  const vendorForm = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorType: 'individual',
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0],
        address: {
          city: '',
          state: '',
          pincode: '',
          fullAddress: '',
        },
      },
    },
  });

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep('phone');
  };

  const onPhoneSubmit = async (data: PhoneFormData) => {
    try {
      setLoading(true);
      setError('');
      await sendOTP({
        to: data.phone,
        channel: 'sms'
      });
      setPhone(data.phone);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormData) => {
    try {
      setLoading(true);
      setError('');
      await verifyOTP(
        phone,
        data.otp
      );
      setStep('details');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !selectedLanguages.includes(languageInput.trim())) {
      setSelectedLanguages([...selectedLanguages, languageInput.trim()]);
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setSelectedLanguages(selectedLanguages.filter(lang => lang !== langToRemove));
  };

  const onWorkerSubmit = async (data: WorkerFormData) => {
    try {
      setLoading(true);
      setError('');
      
      const userData: User = {
        ...data,
        phone,
        skills: selectedSkills,
        languagesSpoken: selectedLanguages,
      };

      await registerUser(userData);
      router.push('/registration-success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onVendorSubmit = async (data: VendorFormData) => {
    try {
      setLoading(true);
      setError('');
      
      const vendorData: Vendor = {
        ...data,
        phone,
      };

      await registerVendor(vendorData);
      router.push('/registration-success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of skilled professionals
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 'type' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Choose your account type</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select whether you want to register as a worker or an employer
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleUserTypeSelect('worker')}
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50"
                >
                  <svg className="w-12 h-12 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Worker</span>
                  <span className="mt-1 text-xs text-gray-500">Find work opportunities</span>
                </button>
                <button
                  onClick={() => handleUserTypeSelect('employer')}
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50"
                >
                  <svg className="w-12 h-12 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Employer</span>
                  <span className="mt-1 text-xs text-gray-500">Post jobs and hire workers</span>
                </button>
              </div>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...phoneForm.register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter 10 digit number"
                />
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP sent to {phone}
                </label>
                <input
                  type="text"
                  id="otp"
                  {...otpForm.register('otp')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter 6 digit OTP"
                />
                {otpForm.formState.errors.otp && (
                  <p className="mt-1 text-sm text-red-600">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-blue-600 hover:text-blue-500"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {step === 'details' && userType === 'worker' && (
            <form onSubmit={workerForm.handleSubmit(onWorkerSubmit)} className="space-y-6">
              {/* Worker registration form fields */}
              {/* ... (existing worker form fields) ... */}
            </form>
          )}

          {step === 'details' && userType === 'employer' && (
            <form onSubmit={vendorForm.handleSubmit(onVendorSubmit)} className="space-y-6">
              {/* Employer registration form fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vendor Type</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...vendorForm.register('vendorType')}
                        value="individual"
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Individual</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...vendorForm.register('vendorType')}
                        value="organization"
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Organization</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                    {vendorForm.watch('vendorType') === 'organization' ? 'Company Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    id="vendorName"
                    {...vendorForm.register('vendorName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...vendorForm.register('email')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    id="aadhaar"
                    {...vendorForm.register('aadhaarNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="12 digit Aadhaar number"
                  />
                </div>

                {vendorForm.watch('vendorType') === 'organization' && (
                  <>
                    <div>
                      <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700">
                        Company Registration Number
                      </label>
                      <input
                        type="text"
                        id="companyRegistrationNumber"
                        {...vendorForm.register('organizationDetails.companyRegistrationNumber')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                        GST Number
                      </label>
                      <input
                        type="text"
                        id="gstNumber"
                        {...vendorForm.register('organizationDetails.gstNumber')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {vendorForm.watch('vendorType') === 'individual' && (
                  <>
                    <div>
                      <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                        Occupation
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        {...vendorForm.register('individualDetails.occupation')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experienceYears"
                        {...vendorForm.register('individualDetails.experienceYears', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Location Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Location</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        {...vendorForm.register('currentLocation.address.city')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        {...vendorForm.register('currentLocation.address.state')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        {...vendorForm.register('currentLocation.address.pincode')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700">
                        Full Address
                      </label>
                      <input
                        type="text"
                        id="fullAddress"
                        {...vendorForm.register('currentLocation.address.fullAddress')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 