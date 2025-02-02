'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  averageRating: number;
  totalHires: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'hire' | 'completed';
  workerName: string;
  jobTitle: string;
  timestamp: string;
}

export default function EmployerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalApplications: 0,
    averageRating: 0,
    totalHires: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Mock data
        setStats({
          activeJobs: 5,
          totalApplications: 25,
          averageRating: 4.5,
          totalHires: 12
        });

        setRecentActivity([
          {
            id: '1',
            type: 'application',
            workerName: 'John Doe',
            jobTitle: 'Plumbing Work',
            timestamp: '2024-03-15T10:00:00Z'
          },
          {
            id: '2',
            type: 'hire',
            workerName: 'Jane Smith',
            jobTitle: 'Electrical Repair',
            timestamp: '2024-03-14T15:30:00Z'
          },
          {
            id: '3',
            type: 'completed',
            workerName: 'Mike Johnson',
            jobTitle: 'Carpentry Work',
            timestamp: '2024-03-13T09:15:00Z'
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      icon: BriefcaseIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Applications',
      value: stats.totalApplications,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Average Rating',
      value: `${stats.averageRating}/5`,
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Total Hires',
      value: stats.totalHires,
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Post New Job
          </Link>
        </div>

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
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'application' && (
                        <UserGroupIcon className="h-6 w-6 text-blue-500" />
                      )}
                      {activity.type === 'hire' && (
                        <BriefcaseIcon className="h-6 w-6 text-green-500" />
                      )}
                      {activity.type === 'completed' && (
                        <StarIcon className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.workerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.type === 'application' && 'Applied for '}
                        {activity.type === 'hire' && 'Hired for '}
                        {activity.type === 'completed' && 'Completed '}
                        {activity.jobTitle}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 