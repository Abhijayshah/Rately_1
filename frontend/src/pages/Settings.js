import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings = () => {
  const { user, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form for Password Update
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  // Form for Profile Update
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm();

  useEffect(() => {
    if (user) {
      setProfileValue('name', user.name);
      setProfileValue('email', user.email);
      setProfileValue('address', user.address);
    }
  }, [user, setProfileValue]);

  const newPassword = watchPassword('newPassword');

  const onSubmitPassword = async (data) => {
    setIsUpdating(true);
    try {
      const result = await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      if (result.success) {
        toast.success('Password updated successfully');
        resetPassword();
      }
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitProfile = async (data) => {
    setIsUpdating(true);
    try {
      await authAPI.updateProfile({
        name: data.name,
        email: data.email,
        address: data.address,
      });
      
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
      
      // Update local user context if needed, but page refresh or context update is better
      // Ideally AuthContext should expose a way to refresh user data or we can manually update it
      // For now, let's reload the page to get fresh data or trust the response
      // But reloading is bad UX.
      // We can't easily update AuthContext user without an exposed method.
      // Let's assume the user will see the changes on next fetch or we can try to force a refresh if possible.
      // Actually, useAuth exposes 'user'. We might need to reload the window to refresh the context
      // or implement a refreshUser method in AuthContext.
      // For now, I'll trigger a window reload after a short delay or just show success.
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-purple',
      store_owner: 'badge-green',
      normal_user: 'badge-blue',
    };
    return badges[role] || 'badge-gray';
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
              <p className="text-gray-400">Your account details and information</p>
            </div>
            {!isEditingProfile && (
              <Button
                variant="ghost"
                size="sm"
                icon={Edit2}
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className="card-body">
            {isEditingProfile ? (
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  error={profileErrors.name?.message}
                  {...registerProfile('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  error={profileErrors.email?.message}
                  {...registerProfile('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                
                <Input
                  label="Address"
                  name="address"
                  placeholder="Enter your address"
                  required
                  error={profileErrors.address?.message}
                  {...registerProfile('address', {
                    required: 'Address is required',
                  })}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isUpdating}
                    icon={Save}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
                    <p className="text-white">{user?.name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
                    <span className={`badge ${getRoleBadge(user?.role)}`}>
                      {formatRole(user?.role || '')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Member Since
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
                    <p className="text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-700 rounded-lg">
                    <p className="text-white">{user?.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <p className="text-gray-400">Update your account password</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <div className="max-w-md">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    required
                    error={passwordErrors.currentPassword?.message}
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="max-w-md">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password (8-16 characters)"
                    required
                    error={passwordErrors.newPassword?.message}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      maxLength: {
                        value: 16,
                        message: 'Password must not exceed 16 characters',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
                        message: 'Password must contain at least one uppercase letter and one special character',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="max-w-md">
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    required
                    error={passwordErrors.confirmPassword?.message}
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (value) =>
                        value === newPassword || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Password Requirements */}
              <div className="max-w-md p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <h4 className="text-sm font-medium text-white mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 8-16 characters long</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one special character</li>
                </ul>
              </div>
              
              <div className="flex justify-start">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isUpdating}
                  icon={Save}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;