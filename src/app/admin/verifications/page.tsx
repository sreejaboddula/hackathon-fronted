'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Verification {
  id: string;
  name: string;
  type: 'worker' | 'vendor';
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    type: string;
    url: string;
  }[];
  submittedAt: string;
  skills?: string[];
  businessName?: string;
  rejectionReason?: string;
}

export default function VerificationsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVerifications(activeTab);
  }, [activeTab]);

  const fetchVerifications = async (status: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Simulated API response
      const response = {
        data: [
          {
            id: '1',
            name: 'John Doe',
            type: 'worker',
            status: status,
            documents: [
              { type: 'Aadhaar', url: '/docs/aadhaar.pdf' },
              { type: 'Skill Certificate', url: '/docs/cert.pdf' }
            ],
            submittedAt: '2024-03-15T10:00:00Z',
            skills: ['Plumbing', 'Electrical'],
          },
          // Add more mock data as needed
        ]
      };
      setVerifications(response.data);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // TODO: Implement API call to approve verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      fetchVerifications(activeTab);
    } catch (error) {
      console.error('Failed to approve verification:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      // TODO: Implement API call to reject verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsModalOpen(false);
      setRejectionReason('');
      fetchVerifications(activeTab);
    } catch (error) {
      console.error('Failed to reject verification:', error);
    }
  };

  const openRejectModal = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsModalOpen(true);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Verifications</h1>

        {/* Status Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status as any)}
                className={`${
                  activeTab === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {status}
              </button>
            ))}
          </nav>
        </div>

        {/* Verifications List */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading verifications...</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {verifications.map((verification) => (
                  <li key={verification.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {verification.name}
                          </p>
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {verification.type}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {activeTab === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(verification.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(verification)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {verification.skills?.join(', ') || verification.businessName}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Submitted on{' '}
                            {new Date(verification.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {verification.rejectionReason && (
                        <div className="mt-2 text-sm text-red-600">
                          Rejection reason: {verification.rejectionReason}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">Reject Verification</h3>
            <div className="mt-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                Reason for Rejection
              </label>
              <textarea
                id="rejectionReason"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedVerification!.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 