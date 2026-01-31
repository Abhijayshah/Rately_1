import React, { useState, useEffect } from 'react';
import { Users, Store, Star, TrendingUp, Award, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, storeAPI } from '../services/api';
import Loading from '../components/ui/Loading';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, isAdmin, isNormalUser, isStoreOwner } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [storeStats, setStoreStats] = useState(null);
  const [recentRatings, setRecentRatings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (isAdmin()) {
          // Fetch admin dashboard stats
          const response = await adminAPI.getDashboardStats();
          setStats(response.data);
        } else if (isStoreOwner()) {
          // Fetch store owner dashboard data
          const ratingsResponse = await storeAPI.getOwnerDashboard();
          setStoreStats(ratingsResponse.data);
          setRecentRatings(ratingsResponse.data.ratings || []);
        } else if (isNormalUser()) {
          // Fetch user's recent ratings
          const ratingsResponse = await storeAPI.getUserRatings({ page: 1, limit: 5 });
          setRecentRatings(ratingsResponse.data.ratings || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, isNormalUser, isStoreOwner]);

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-sm text-gray-400">
          Welcome back, {user?.name}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Stores</p>
                <p className="text-2xl font-bold text-white">{stats?.totalStores || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Ratings</p>
                <p className="text-2xl font-bold text-white">{stats?.totalRatings || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <p className="font-medium text-white">Manage Users</p>
              <p className="text-sm text-gray-400">Add, view, and manage users</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/stores'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Store className="w-8 h-8 text-green-400 mb-2" />
              <p className="font-medium text-white">Manage Stores</p>
              <p className="text-sm text-gray-400">Add and view stores</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/analytics'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
              <p className="font-medium text-white">View Analytics</p>
              <p className="text-sm text-gray-400">System performance metrics</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/stores?sortBy=averageRating&sortOrder=desc'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Award className="w-8 h-8 text-orange-400 mb-2" />
              <p className="font-medium text-white">Top Rated Stores</p>
              <p className="text-sm text-gray-400">View highest rated stores</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoreOwnerDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Store Owner Dashboard</h1>
        <div className="text-sm text-gray-400">
          Welcome back, {user?.name}
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-white">
                  {storeStats?.store?.averageRating ? storeStats.store.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Ratings</p>
                <p className="text-2xl font-bold text-white">{storeStats?.store?.totalRatings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Store Rank</p>
                <p className="text-2xl font-bold text-white">#{storeStats?.store?.rank || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Rating Distribution</h3>
          </div>
          <div className="card-body space-y-3">
            {[5, 4, 3, 2, 1].map(star => {
              const count = storeStats?.store?.distribution?.[star] || 0;
              const total = storeStats?.store?.totalRatings || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center">
                  <span className="w-12 text-sm text-gray-400 flex items-center">
                    {star} <Star className="w-3 h-3 ml-1 text-gray-500" />
                  </span>
                  <div className="flex-1 h-2 mx-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-400 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="card lg:col-span-2">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Ratings</h3>
            <button 
              onClick={() => window.location.href = '/my-store'}
              className="text-sm text-primary-400 hover:text-primary-300 font-medium"
            >
              View All Ratings
            </button>
          </div>
          <div className="card-body">
            {recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.slice(0, 5).map((rating, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{rating.userName}</p>
                      <p className="text-sm text-gray-400">{rating.userEmail}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-white">{rating.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No ratings yet</p>
                <p className="text-sm text-gray-500">Your store ratings will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNormalUserDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Welcome to Rately</h1>
        <div className="text-sm text-gray-400">
          Hello, {user?.name}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-500">
        <div className="card-body">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8" />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-bold">Discover Amazing Stores</h2>
              <p className="text-primary-100 mt-1">
                Rate and review stores to help others make better choices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Your Ratings</p>
                <p className="text-2xl font-bold text-white">{recentRatings.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Stores Available</p>
                <p className="text-2xl font-bold text-white">Browse All</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      {recentRatings.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Your Recent Ratings</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentRatings.slice(0, 3).map((rating, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{rating.storeName}</p>
                    <p className="text-sm text-gray-400">{rating.storeAddress}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">{rating.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/stores'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Store className="w-8 h-8 text-blue-400 mb-2" />
              <p className="font-medium text-white">Browse Stores</p>
              <p className="text-sm text-gray-400">Discover and rate stores</p>
            </button>
            <button 
              onClick={() => window.location.href = '/my-ratings'}
              className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Star className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="font-medium text-white">My Ratings</p>
              <p className="text-sm text-gray-400">View your rating history</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {isAdmin() && renderAdminDashboard()}
      {isStoreOwner() && renderStoreOwnerDashboard()}
      {isNormalUser() && renderNormalUserDashboard()}
    </div>
  );
};

export default Dashboard;