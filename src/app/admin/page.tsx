'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface AdminStats {
  totalWorkers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
}

const initialStats: AdminStats = {
  totalWorkers: 0,
  totalEmployers: 0,
  totalJobs: 0,
  activeJobs: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const response = {
          data: {
            totalWorkers: 150,
            totalEmployers: 45,
            totalJobs: 89,
            activeJobs: 34,
          }
        };
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Workers',
      value: stats.totalWorkers,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Employers',
      value: stats.totalEmployers,
      icon: BuildingOfficeIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Total Jobs',
      value: stats.totalJobs,
      icon: BriefcaseIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      icon: CheckCircleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">Activity feed coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 