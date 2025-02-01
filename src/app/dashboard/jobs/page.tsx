'use client';

import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

const categories = [
  'All',
  'Software Development',
  'Data Science',
  'Design',
  'Marketing',
  'Sales',
  'Customer Service',
  'Finance',
  'HR',
  'Other',
];

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch jobs
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'Tech Corp',
            location: 'Bangalore',
            salary: '20-30 LPA',
            type: 'Full-time',
            category: 'Software Development',
            description: 'We are looking for an experienced frontend developer...',
            requirements: [
              '5+ years of experience with React',
              'Strong TypeScript skills',
              'Experience with Next.js',
            ],
            postedAt: '2024-02-20',
          },
          // Add more mock jobs here
        ];
        setJobs(mockJobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = async (jobId: string) => {
    try {
      setLoading(true);
      // TODO: Implement API call to apply for job
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Applied for job:', jobId);
      // Show success message
    } catch (error) {
      console.error('Failed to apply for job:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Search and Filter */}
        <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BriefcaseIcon className="h-5 w-5 mr-2" />
                      {job.category}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{job.description}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Posted on {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Apply Now
                    </button>
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