import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Eye, Store, MapPin, Mail } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import StarRating from '../../components/ui/StarRating';

const Stores = () => {
  const [searchParams] = useSearchParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    sortBy: searchParams.get('sortBy') || 'name',
    sortOrder: searchParams.get('sortOrder') || 'asc',
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState([]);

  const sortOptions = [
    { value: 'name', label: 'Store Name' },
    { value: 'email', label: 'Email' },
    { value: 'averageRating', label: 'Rating' },
    { value: 'totalRatings', label: 'Total Ratings' },
    { value: 'createdAt', label: 'Created Date' },
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
      
      const response = await adminAPI.getStores(params);
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

  const fetchUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getUsers({ role: 'store_owner', limit: 100 });
      setUsers(response.data.users.filter(user => !user.store));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSort = (column) => {
    const newSortOrder = 
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ ...filters, sortBy: column, sortOrder: newSortOrder });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const handleViewStore = (store) => {
    setSelectedStore(store);
    setShowStoreModal(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (_, store) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Store className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-medium">{store.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Address',
      render: (_, store) => (
        <span className="text-sm text-gray-600 truncate max-w-xs" title={store.address}>
          {store.address}
        </span>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (_, store) => (
        <div>
          <p className="font-medium">{store.ownerName}</p>
          <p className="text-sm text-gray-600">{store.ownerEmail}</p>
        </div>
      ),
    },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (_, store) => (
        <div className="flex items-center space-x-2">
          <StarRating 
            rating={store.averageRating || 0} 
            readonly 
            size="sm" 
          />
          <span className="text-sm text-gray-600">
            ({store.totalRatings || 0})
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (_, store) => (
        <span className="text-sm text-gray-600">
          {new Date(store.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, store) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewStore(store)}
            icon={Eye}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (loading && stores.length === 0) {
    return <Loading text="Loading stores..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores Management</h1>
          <p className="text-gray-600">Manage stores and their information</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Add Store
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by store name, email, or address..."
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

      {/* Stores Table */}
      <div className="card">
        <div className="card-body p-0">
          <Table
            columns={columns}
            data={stores}
            loading={loading}
            onSort={handleSort}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            emptyMessage="No stores found"
          />
          
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t">
              <Table.Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedStore.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <StarRating 
                    rating={selectedStore.averageRating || 0} 
                    readonly 
                    size="sm" 
                  />
                  <span className="text-sm text-gray-600">
                    ({selectedStore.totalRatings || 0} ratings)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{selectedStore.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <p className="text-gray-900">{selectedStore.ownerName}</p>
                <p className="text-sm text-gray-600">{selectedStore.ownerEmail}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-900">{selectedStore.address}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Rating
                </label>
                <div className="flex items-center space-x-2">
                  <StarRating 
                    rating={selectedStore.averageRating || 0} 
                    readonly 
                    showValue 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Ratings
                </label>
                <p className="text-gray-900">{selectedStore.totalRatings || 0}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {new Date(selectedStore.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {new Date(selectedStore.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Store Modal */}
      <CreateStoreModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchStores();
          fetchUsers();
        }}
        users={users}
      />
    </div>
  );
};

// Create Store Modal Component
const CreateStoreModal = ({ isOpen, onClose, onSuccess, users }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await adminAPI.createStore(formData);
      toast.success('Store created successfully');
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating store:', error);
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const fieldErrors = {};
        error.response.data.details.forEach(err => {
          fieldErrors[err.param || err.path] = err.msg;
        });
        setErrors(fieldErrors);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create store');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Store"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Store Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter store name (3-60 characters)"
          required
          error={errors.name}
        />
        
        <Input
          label="Store Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter store email address"
          required
          error={errors.email}
        />
        
        <Input
          label="Store Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter store address (max 400 characters)"
          required
          error={errors.address}
        />
        
        <Select
          label="Store Owner"
          name="ownerId"
          value={formData.ownerId}
          onChange={handleChange}
          options={userOptions}
          placeholder="Select a store owner"
          required
          error={errors.ownerId}
        />
        
        {userOptions.length === 0 && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-200">
              No available store owners found. Please create a user with 'Store Owner' role first.
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={userOptions.length === 0}
          >
            Create Store
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Stores;
