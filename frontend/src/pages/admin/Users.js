import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Eye, User, Crown, Store, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'system_admin', label: 'System Admin' },
    { value: 'normal_user', label: 'Normal User' },
    { value: 'store_owner', label: 'Store Owner' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        role: filters.role,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

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

  const handleViewUser = async (userId) => {
    try {
      const response = await adminAPI.getUserById(userId);
      setSelectedUser(response.data.user);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    }
  };

  const handleEditUser = async (userId) => {
    try {
      const response = await adminAPI.getUserById(userId);
      setSelectedUser(response.data.user);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    try {
      await adminAPI.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'system_admin':
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'store_owner':
        return <Store className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      system_admin: 'badge-purple',
      admin: 'badge-purple',
      store_owner: 'badge-green',
      normal_user: 'badge-blue',
    };
    return badges[role] || 'badge-gray';
  };

  const formatRole = (role) => {
    if (!role) return 'Unknown';
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="font-medium text-white">{user.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (_, user) => (
        <span className="text-gray-300">{user.email}</span>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (_, user) => (
        <span className="text-sm text-gray-400 truncate max-w-xs" title={user.address}>
          {user.address}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          {getRoleIcon(user.role)}
          <span className={`badge ${getRoleBadge(user.role)}`}>
            {formatRole(user.role)}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (_, user) => (
        <span className="text-sm text-gray-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewUser(user.id)}
            icon={Eye}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(user.id)}
            icon={Edit}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            title="Edit User"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(user)}
            icon={Trash2}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
            title="Delete User"
          />
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return <Loading text="Loading users..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400">Manage system users and their roles</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, email, or address..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              placeholder="Filter by role"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              options={roleOptions}
            />
            <Select
              placeholder="Sort by"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <Table
            columns={columns}
            data={users}
            loading={loading}
            onSort={handleSort}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            emptyMessage="No users found"
          />
          
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-700">
              <Table.Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(selectedUser.role)}
                  <span className={`badge ${getRoleBadge(selectedUser.role)}`}>
                    {formatRole(selectedUser.role)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <p className="text-white">{formatRole(selectedUser.role)}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Address
                </label>
                <p className="text-white">{selectedUser.address}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Created At
                </label>
                <p className="text-white">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Last Updated
                </label>
                <p className="text-white">
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Store Information for Store Owners */}
            {selectedUser.role === 'store_owner' && selectedUser.store && (
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Store Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Store Name
                    </label>
                    <p className="text-white">{selectedUser.store.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Store Email
                    </label>
                    <p className="text-white">{selectedUser.store.email}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Store Address
                    </label>
                    <p className="text-white">{selectedUser.store.address}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Average Rating
                    </label>
                    <p className="text-white">
                      {selectedUser.store.averageRating ? 
                        `${selectedUser.store.averageRating.toFixed(1)} / 5` : 
                        'No ratings yet'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Total Ratings
                    </label>
                    <p className="text-white">{selectedUser.store.totalRatings || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-400 bg-red-900/30 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">
              This action cannot be undone. This will permanently delete the user account
              {userToDelete?.role === 'store_owner' && ' and their associated store'}.
            </p>
          </div>
          
          <p className="text-gray-400">
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchUsers();
        }}
      />
    </div>
  );
};

// Create User Modal Component
const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal_user',
    storeName: '',
    storeEmail: '',
    storeAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'normal_user', label: 'Normal User' },
    { value: 'store_owner', label: 'Store Owner' },
    { value: 'system_admin', label: 'System Admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await adminAPI.createUser(formData);
      toast.success('User created successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'normal_user',
        storeName: '',
        storeEmail: '',
        storeAddress: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const fieldErrors = {};
        error.response.data.details.forEach(err => {
          fieldErrors[err.param || err.path] = err.msg;
        });
        setErrors(fieldErrors);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create user');
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
      title="Create New User"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name (3-60 characters)"
          required
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          error={errors.email}
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (8-16 characters)"
          required
          error={errors.password}
        />
        
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address (max 400 characters)"
          required
          error={errors.address}
        />
        
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
          error={errors.role}
        />
        
        {formData.role === 'store_owner' && (
          <>
            <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                Optional: Provide store details to auto-create the store for this owner.
              </p>
            </div>
            <Input
              label="Store Name"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Enter store name (3-60 characters)"
              error={errors.storeName}
            />
            <Input
              label="Store Email"
              name="storeEmail"
              type="email"
              value={formData.storeEmail}
              onChange={handleChange}
              placeholder="Enter store email"
              error={errors.storeEmail}
            />
            <Input
              label="Store Address"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              placeholder="Enter store address (max 400 characters)"
              error={errors.storeAddress}
            />
          </>
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
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Edit User Modal Component
const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    password: '', // Optional password update
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'normal_user', label: 'Normal User' },
    { value: 'store_owner', label: 'Store Owner' },
    { value: 'system_admin', label: 'System Admin' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        role: user.role || 'normal_user',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await adminAPI.updateUser(user.id, updateData);
      toast.success('User updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const fieldErrors = {};
        error.response.data.details.forEach(err => {
          fieldErrors[err.param || err.path] = err.msg;
        });
        setErrors(fieldErrors);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update user');
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
      title="Edit User"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          error={errors.email}
        />
        
        <Input
          label="New Password (Optional)"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current password"
          error={errors.password}
        />
        
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          required
          error={errors.address}
        />
        
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
          error={errors.role}
        />
        
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
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Users;
