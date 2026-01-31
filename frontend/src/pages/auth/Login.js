import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Store, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Always redirect to dashboard to prevent "Access Denied" glitches
      // from stale location state or role mismatches
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back to Rately
          </p>
        </div>
        
        {/* Login Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
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
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                required
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
            
            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sign up here
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

export default Login;