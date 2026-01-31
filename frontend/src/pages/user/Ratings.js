import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Store, MapPin, Calendar, Edit } from 'lucide-react';
import { storeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import StarRating from '../../components/ui/StarRating';
import { useAuth } from '../../contexts/AuthContext';

const Ratings = () => {
  useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };
      
      const response = await storeAPI.getUserRatings(params);
      setRatings(response.data.ratings);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleEditRating = (rating) => {
    setEditingRating(rating);
    setNewRating(rating.rating);
    setShowEditModal(true);
  };

  const handleUpdateRating = async () => {
    if (newRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    try {
      await storeAPI.submitRating({
        storeId: editingRating.storeId,
        rating: newRating,
      });
      
      toast.success('Rating updated successfully');
      setShowEditModal(false);
      fetchRatings(); // Refresh ratings
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error(error.response?.data?.message || 'Failed to update rating');
    } finally {
      setSubmittingRating(false);
    }
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

  if (loading && ratings.length === 0) {
    return <Loading text="Loading your ratings..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Ratings</h1>
          <p className="text-gray-400">View and manage your store ratings</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {pagination.total} ratings
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <Input
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-green-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-white">
                          {rating.storeName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <StarRating 
                            rating={rating.rating} 
                            readonly 
                            size="sm" 
                          />
                          <span className="text-sm font-medium text-gray-400">
                            {rating.rating} / 5
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRating(rating)}
                        icon={Edit}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{rating.storeAddress}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Rated on {formatDate(rating.createdAt)}</span>
                        {rating.updatedAt !== rating.createdAt && (
                          <span className="text-gray-500">
                            (Updated: {formatDate(rating.updatedAt)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && ratings.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ? 'No ratings found' : 'No ratings yet'}
          </h3>
          <p className="text-gray-400 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Start rating stores to see them here'
            }
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={() => window.location.href = '/stores'}>
              Browse Stores
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
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

      {/* Edit Rating Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Rating"
        size="md"
      >
        {editingRating && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{editingRating.storeName}</h3>
                  <p className="text-sm text-gray-400">Update your rating</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Current rating:</p>
                <StarRating
                  rating={editingRating.rating}
                  readonly
                  showValue
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">New rating:</p>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  size="lg"
                  showValue
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                disabled={submittingRating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateRating}
                loading={submittingRating}
                disabled={newRating === 0}
              >
                Update Rating
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Ratings;