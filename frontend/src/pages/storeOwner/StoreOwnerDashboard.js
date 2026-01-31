import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, User, Calendar, TrendingUp, Award, Users } from 'lucide-react';
import { storeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import StarRating from '../../components/ui/StarRating';
import { useAuth } from '../../contexts/AuthContext';

const StoreOwnerDashboard = () => {
  useAuth();

  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStoreRatings = useCallback(async () => {
    try {
      setRatingsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };
      
      const response = await storeAPI.getOwnerDashboard(params);
      if (response.data.store) {
        setStoreData({
          averageRating: response.data.store.averageRating,
          totalRatings: response.data.store.totalRatings,
          storeName: response.data.store.name,
          storeEmail: response.data.store.email,
          storeAddress: response.data.store.address,
          rank: response.data.store.rank,
          distribution: response.data.store.distribution,
        });
        setRatings(response.data.ratings);
        
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.totalRatings,
            totalPages: response.data.pagination.totalPages,
            page: response.data.pagination.currentPage,
            limit: response.data.pagination.limit
          }));
        } else {
          // Fallback if pagination data is missing (should not happen with updated backend)
          setPagination(prev => ({
            ...prev,
            total: response.data.ratings.length,
            totalPages: 1,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching store ratings:', error);
      toast.error('Failed to fetch store ratings');
    } finally {
      setLoading(false);
      setRatingsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchStoreRatings();
  }, [fetchStoreRatings]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return <Loading text="Loading store dashboard..." />;
  }

  if (!storeData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No store found
          </h3>
          <p className="text-gray-400">
            You don't have a store associated with your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Dashboard</h1>
          <p className="text-gray-400">Monitor your store's ratings and feedback</p>
        </div>
      </div>

      {/* Store Overview */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{storeData.storeName}</h2>
          <p className="text-gray-400">{storeData.storeEmail}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Average Rating</h3>
              <div className={`text-3xl font-bold ${getAverageRatingColor(storeData.averageRating || 0)}`}>
                {storeData.averageRating ? storeData.averageRating.toFixed(1) : 'N/A'}
              </div>
              <StarRating 
                rating={storeData.averageRating || 0} 
                readonly 
                size="sm" 
              />
            </div>

            {/* Total Ratings */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Ratings</h3>
              <div className="text-3xl font-bold text-white">
                {storeData.totalRatings || 0}
              </div>
              <p className="text-sm text-gray-500">customer reviews</p>
            </div>

            {/* Store Rank */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Store Rank</h3>
              <div className="text-3xl font-bold text-white">
                #{storeData.rank || 'N/A'}
              </div>
              <p className="text-sm text-gray-500">overall ranking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {storeData.totalRatings > 0 && (
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Rating Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = storeData.distribution?.[rating] || 0;
                const percentage = storeData.totalRatings > 0 ? (count / storeData.totalRatings) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium text-gray-300">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400 w-16 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Ratings */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Customer Ratings</h3>
            <div className="text-sm text-gray-400">
              Total: {pagination.total} ratings
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search by customer name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Ratings List */}
          <div className="space-y-4">
            {ratingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : ratings.length > 0 ? (
              ratings.map((rating) => (
                <div key={rating.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{rating.userName}</h4>
                        <p className="text-sm text-gray-400">{rating.userEmail}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {formatDate(rating.createdAt)}
                            {rating.updatedAt !== rating.createdAt && (
                              <span className="ml-1">(Updated: {formatDate(rating.updatedAt)})</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <StarRating 
                          rating={rating.rating} 
                          readonly 
                          size="sm" 
                        />
                      </div>
                      <span className="text-lg font-bold text-white">{rating.rating}/5</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">
                  {searchTerm ? 'No ratings found' : 'No ratings yet'}
                </h4>
                <p className="text-gray-400">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'Customer ratings will appear here when they rate your store'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;