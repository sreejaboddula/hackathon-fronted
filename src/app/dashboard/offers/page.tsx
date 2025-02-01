'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Offer {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  status: 'pending' | 'accepted' | 'rejected';
  deadline: string;
  description: string;
  benefits: string[];
  receivedAt: string;
}

export default function OffersPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch offers
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockOffers: Offer[] = [
          {
            id: '1',
            jobTitle: 'Senior Frontend Developer',
            company: 'Tech Corp',
            location: 'Bangalore',
            salary: '20-30 LPA',
            status: 'pending',
            deadline: '2024-03-01',
            description: 'We are excited to offer you the position of Senior Frontend Developer...',
            benefits: [
              'Health Insurance',
              'Annual Bonus',
              'Flexible Work Hours',
              'Remote Work Options',
            ],
            receivedAt: '2024-02-20',
          },
          // Add more mock offers here
        ];
        setOffers(mockOffers);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setLoading(true);
      // TODO: Implement API call to accept offer
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: 'accepted' } : offer
      ));
      // Show success message
    } catch (error) {
      console.error('Failed to accept offer:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      setLoading(true);
      // TODO: Implement API call to reject offer
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: 'rejected' } : offer
      ));
      // Show success message
    } catch (error) {
      console.error('Failed to reject offer:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: Offer['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Offers</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No job offers found.</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{offer.jobTitle}</h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        offer.status
                      )}`}
                    >
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      {offer.company}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      {offer.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                      {offer.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Deadline: {new Date(offer.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Benefits:</h3>
                    <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {offer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Received on {new Date(offer.receivedAt).toLocaleDateString()}
                    </span>
                    {offer.status === 'pending' && (
                      <div className="space-x-4">
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 