'use client';

import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { getAvailableJobs, applyForJob, getWorkerApplications } from '@/services/api';
import { Job } from '@/types';

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
  const [applying, setApplying] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsResponse, applicationsResponse] = await Promise.all([
          getAvailableJobs(),
          getWorkerApplications()
        ]);
        setJobs(jobsResponse.data);
        // Extract job IDs from applications
        const appliedJobIds = applicationsResponse.data.map((app: any) => app.jobId);
        setAppliedJobs(appliedJobIds);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = async (jobId: string) => {
    if (appliedJobs.includes(jobId)) {
      alert('You have already applied for this job.');
      return;
    }

    try {
      setApplying(true);
      await applyForJob(jobId);
      setAppliedJobs([...appliedJobs, jobId]);
      alert('Successfully applied for the job!');
    } catch (error) {
      console.error('Failed to apply for job:', error);
      alert('Failed to apply for the job. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Available Jobs</h1>
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
          {filteredJobs.length === 0 ? (
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
                    <h2 className="text-xl font-semibold text-gray-900">{job.jobTitle}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {job.workingHours.from} - {job.workingHours.to}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      {job.location.address.city}, {job.location.address.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                      {job.salary.amount} {job.salary.period}
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
                    <h3 className="text-sm font-medium text-gray-900">Required Skills:</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.requiredSkills.map((skill, index) => (
                        <li key={index}>{skill.skill} - {skill.experienceYears} years</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Benefits:</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Duration: {job.duration}
                    </span>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applying || appliedJobs.includes(job.id)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        appliedJobs.includes(job.id)
                          ? 'bg-green-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                    >
                      {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
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