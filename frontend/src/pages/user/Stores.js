import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, MapPin, Mail, Store as StoreIcon } from 'lucide-react';
import { storeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import StarRating from '../../components/ui/StarRating';
import { useAuth } from '../../contexts/AuthContext';

const Stores = () => {
  useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({ rating: 0, storeId: null });
  const [submittingRating, setSubmittingRating] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Store Name' },
    { value: 'averageRating', label: 'Rating (High to Low)' },
    { value: 'totalRatings', label: 'Most Rated' },
    { value: 'createdAt', label: 'Newest First' },
  ];

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      
      const response = await storeAPI.getStores(params);
      setStores(response.data.stores);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleViewStore = async (storeId) => {
    try {
      const response = await storeAPI.getStoreById(storeId);
      setSelectedStore(response.data);
      setShowStoreModal(true);
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast.error('Failed to fetch store details');
    }
  };

  const handleRateStore = (store) => {
    setRatingData({ 
      rating: store.userRating || 0, 
      storeId: store.id 
    });
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (ratingData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    try {
      await storeAPI.submitRating({
        storeId: ratingData.storeId,
        rating: ratingData.rating,
      });
      
      toast.success('Rating submitted successfully');
      setShowRatingModal(false);
      fetchStores(); // Refresh stores to show updated ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading && stores.length === 0) {
    return <Loading text="Loading stores..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Browse Stores</h1>
          <p className="text-gray-400">Discover and rate amazing stores</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search stores by name, email, or address..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              placeholder="Sort by"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="card hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center">
                    <StoreIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{store.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <StarRating 
                        rating={store.averageRating || 0} 
                        readonly 
                        size="sm" 
                      />
                      <span className="text-sm text-gray-400">
                        ({store.totalRatings || 0})
                      </span>
                    </div>
                  </div>
                </div>
                {store.userRating && (
                  <div className="flex items-center space-x-1 bg-yellow-900/30 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-yellow-400">
                      {store.userRating}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="line-clamp-2">{store.address}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleViewStore(store.id)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRateStore(store)}
                  className="flex-1"
                >
                  {store.userRating ? 'Update Rating' : 'Rate Store'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && stores.length === 0 && (
        <div className="text-center py-12">
          <StoreIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No stores found</h3>
          <p className="text-gray-400">
            {filters.search ? 'Try adjusting your search criteria' : 'No stores available at the moment'}
          </p>
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

      {/* Store Details Modal */}
      <Modal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        title="Store Details"
        size="lg"
      >
        {selectedStore && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center">
                <StoreIcon className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedStore.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <StarRating 
                    rating={selectedStore.averageRating || 0} 
                    readonly 
                    showValue 
                  />
                  <span className="text-sm text-gray-400">
                    ({selectedStore.totalRatings || 0} ratings)
                  </span>
                </div>
                {selectedStore.userRating && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-400">Your rating:</span>
                    <div className="flex items-center space-x-1 bg-yellow-900/30 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-yellow-400">
                        {selectedStore.userRating}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-white">{selectedStore.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Owner
                </label>
                <p className="text-white">{selectedStore.ownerName}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Address
                </label>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-white">{selectedStore.address}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowStoreModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowStoreModal(false);
                  handleRateStore(selectedStore);
                }}
              >
                {selectedStore.userRating ? 'Update Rating' : 'Rate Store'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Rate Store"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              How would you rate this store?
            </p>
            <StarRating
              rating={ratingData.rating}
              onRatingChange={(rating) => setRatingData({ ...ratingData, rating })}
              size="lg"
              showValue
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowRatingModal(false)}
              disabled={submittingRating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitRating}
              loading={submittingRating}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stores;