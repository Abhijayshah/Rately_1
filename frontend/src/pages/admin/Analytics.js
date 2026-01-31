import React, { useState, useEffect } from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Loading from '../../components/ui/Loading';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Stores</p>
              <p className="text-2xl font-bold text-white">{stats?.totalStores || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Ratings</p>
              <p className="text-2xl font-bold text-white">{stats?.totalRatings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 mt-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-white">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
          Growth Trends
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-700/50 rounded border border-dashed border-gray-600">
          <p className="text-gray-400">Detailed charts and graphs coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
