import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Store, User, Mail, Lock, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const password = watch('password');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
      });
      // Navigation is handled by the useEffect above when isAuthenticated becomes true
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-900/20 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join Rately to rate and review stores
          </p>
        </div>
        
        {/* Registration Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name (3-60 characters)"
                icon={User}
                required
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                  maxLength: {
                    value: 60,
                    message: 'Name must not exceed 60 characters',
                  },
                })}
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                icon={Mail}
                required
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              
              <Input
                label="Address"
                type="text"
                placeholder="Enter your address (max 400 characters)"
                icon={MapPin}
                required
                error={errors.address?.message}
                {...register('address', {
                  required: 'Address is required',
                  maxLength: {
                    value: 400,
                    message: 'Address must not exceed 400 characters',
                  },
                })}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password (8-16 characters)"
                icon={Lock}
                required
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
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
              
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
            
            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <h4 className="text-sm font-medium text-white mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 8-16 characters long</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one special character</li>
              </ul>
            </div>
            
            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Rately. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;