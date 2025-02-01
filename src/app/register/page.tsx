'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoForm from '@/components/forms/BasicInfoForm';
import DocumentInfoForm from '@/components/forms/DocumentInfoForm';
import SkillInfoForm from '@/components/forms/SkillInfoForm';
import { BasicInfo, DocumentInfo, SkillInfo } from '@/types/auth';

const steps = [
  { id: 'basic-info', title: 'Basic Information' },
  { id: 'document-info', title: 'Document Information' },
  { id: 'skill-info', title: 'Skills & Verification' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    basicInfo: null as BasicInfo | null,
    documentInfo: null as DocumentInfo | null,
    skillInfo: null as SkillInfo | null,
  });

  const handleSendOtp = async (phone: string) => {
    try {
      // TODO: Implement OTP sending logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  };

  const handleVerifyOtp = async (phone: string, otp: string) => {
    try {
      // TODO: Implement OTP verification logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return false;
    }
  };

  const handleBasicInfoSubmit = async (data: BasicInfo) => {
    setLoading(true);
    try {
      // TODO: Implement API call to save basic info
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({ ...prev, basicInfo: data }));
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to save basic info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentInfoSubmit = async (data: DocumentInfo) => {
    setLoading(true);
    try {
      // TODO: Implement API call to save document info
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({ ...prev, documentInfo: data }));
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to save document info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillInfoSubmit = async (data: SkillInfo) => {
    setLoading(true);
    try {
      // TODO: Implement API call to save skill info and complete registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({ ...prev, skillInfo: data }));
      router.push('/registration-success');
    } catch (error) {
      console.error('Failed to complete registration:', error);
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

        <nav aria-label="Progress" className="mb-8">
          <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <li key={step.id} className="md:flex-1">
                <div className={`
                  flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0
                  ${index < currentStep ? 'border-blue-600' : index === currentStep ? 'border-blue-600' : 'border-gray-200'}
                `}>
                  <span className={`
                    text-sm font-medium
                    ${index < currentStep ? 'text-blue-600' : index === currentStep ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    Step {index + 1}
                  </span>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === 0 && (
            <BasicInfoForm
              onSubmit={handleBasicInfoSubmit}
              loading={loading}
              onSendOtp={handleSendOtp}
              onVerifyOtp={handleVerifyOtp}
            />
          )}
          {currentStep === 1 && (
            <DocumentInfoForm
              onSubmit={handleDocumentInfoSubmit}
              loading={loading}
            />
          )}
          {currentStep === 2 && (
            <SkillInfoForm
              onSubmit={handleSkillInfoSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
} 