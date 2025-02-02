'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { sendOTP, verifyOTP, checkRegistrationStatus, loginUser, loginVendor } from '@/services/api';

type UserType = 'worker' | 'employer';
type Step = 'type' | 'phone' | 'otp';

const phoneSchema = z.object({
  phone: z.string().min(10).max(10).regex(/^\d+$/, 'Must be a valid phone number'),
});

const otpSchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/, 'Must be a valid OTP'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState<Step>('type');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
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
      
      // First verify the OTP
      await verifyOTP(phone, data.otp);

      // Check if user is already registered
      const isRegistered = await checkRegistrationStatus(phone);
      
      if (isRegistered) {
        // If registered, log them in
        const loginFn = userType === 'worker' ? loginUser : loginVendor;
        await loginFn(phone, data.otp);
        router.push('/dashboard');
      } else {
        // If not registered, redirect to registration with pre-filled data
        localStorage.setItem('registrationPhone', phone);
        localStorage.setItem('registrationType', userType || '');
        router.push('/register');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 'type' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Choose your account type</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select whether you want to sign in as a worker or an employer
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