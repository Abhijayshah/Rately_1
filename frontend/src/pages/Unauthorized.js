import React from 'react';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-900/30 mb-6">
            <ShieldX className="h-12 w-12 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Access Denied
          </h1>
          
          <p className="text-lg text-gray-400 mb-8">
            You don't have permission to access this page.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">
                What can you do?
              </h2>
              
              <ul className="text-left text-gray-400 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-1.5 w-1.5 bg-gray-500 rounded-full mt-2 mr-3"></span>
                  Check if you're logged in with the correct account
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-1.5 w-1.5 bg-gray-500 rounded-full mt-2 mr-3"></span>
                  Contact your administrator if you believe this is an error
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-1.5 w-1.5 bg-gray-500 rounded-full mt-2 mr-3"></span>
                  Return to a page you have access to
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  icon={ArrowLeft}
                  className="w-full sm:w-auto"
                >
                  Go Back
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleGoHome}
                  icon={Home}
                  className="w-full sm:w-auto"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Error Code: 403 - Forbidden
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;