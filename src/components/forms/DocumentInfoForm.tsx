'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DocumentInfo } from '@/types/auth';

const schema = z.object({
  aadhaarNumber: z.string().length(12, 'Aadhaar number must be 12 digits'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().length(6, 'PIN code must be 6 digits'),
    country: z.string().min(1, 'Country is required'),
  }),
});

interface Props {
  onSubmit: (data: DocumentInfo) => void;
  loading: boolean;
}

export default function DocumentInfoForm({ onSubmit, loading }: Props) {
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: {
        country: 'India',
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setAadhaarFile(file);
      setError('');
    }
  };

  const handleFormSubmit = (data: Omit<DocumentInfo, 'aadhaarDocument'>) => {
    if (!aadhaarFile) {
      setError('Please upload your Aadhaar document');
      return;
    }
    onSubmit({ ...data, aadhaarDocument: aadhaarFile });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
          Aadhaar Number
        </label>
        <input
          type="text"
          id="aadhaarNumber"
          {...register('aadhaarNumber')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          maxLength={12}
        />
        {errors.aadhaarNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.aadhaarNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="aadhaarDocument" className="block text-sm font-medium text-gray-700">
          Upload Aadhaar Card
        </label>
        <input
          type="file"
          id="aadhaarDocument"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {aadhaarFile && (
          <p className="mt-1 text-sm text-gray-500">
            Selected file: {aadhaarFile.name}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Address</h3>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            id="street"
            {...register('address.street')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.address?.street && (
            <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              {...register('address.city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              {...register('address.state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.address?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
              PIN Code
            </label>
            <input
              type="text"
              id="pincode"
              {...register('address.pincode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength={6}
            />
            {errors.address?.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.address.pincode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              {...register('address.country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Next'}
      </button>
    </form>
  );
} 