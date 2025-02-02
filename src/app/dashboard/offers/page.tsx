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
import { getJobOffers, respondToOffer } from '@/services/api';
import { Offer } from '@/types';

export default function OffersPage() {
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getJobOffers();
        setOffers(response.data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
        alert('Failed to load offers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setResponding(true);
      await respondToOffer(offerId, 'accepted');
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: 'accepted' } : offer
      ));
      alert('Offer accepted successfully!');
    } catch (error) {
      console.error('Failed to accept offer:', error);
      alert('Failed to accept offer. Please try again.');
    } finally {
      setResponding(false);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      setResponding(true);
      await respondToOffer(offerId, 'rejected');
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: 'rejected' } : offer
      ));
      alert('Offer rejected successfully!');
    } catch (error) {
      console.error('Failed to reject offer:', error);
      alert('Failed to reject offer. Please try again.');
    } finally {
      setResponding(false);
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

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading offers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Offers</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-8 space-y-4">
          {offers.length === 0 ? (
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
                    <h2 className="text-xl font-semibold text-gray-900">{offer.title}</h2>
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
                      {offer.location.address.city}, {offer.location.address.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                      {offer.salary.amount} {offer.salary.period}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Duration: {offer.duration}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Required Skills:</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                      {offer.requiredSkills.map((skill, index) => (
                        <li key={index}>{skill.skill} - {skill.experienceYears} years</li>
                      ))}
                    </ul>
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
                      Start Date: {new Date(offer.startDate).toLocaleDateString()}
                    </span>
                    {offer.status === 'pending' && (
                      <div className="space-x-4">
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          disabled={responding}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          disabled={responding}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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